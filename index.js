const { Server } = require("socket.io");
const io = new Server(5000, {
  cors: true,
});
const emailToScoketMap = new Map();
const socketToEmailMap = new Map();
io.on("connection", (socket) => {
  console.log("socket connected", socket.id);
  socket.on("join_room", (data) => {
    const { email, roomId } = data;
    socketToEmailMap.set(socket.id, email);
    emailToScoketMap.set(email, socket);
    io.to(roomId).emit("user_joined", data);
    socket.join(roomId);
    io.to(socket.id).emit("join_room", data);
  });

  socket.on("user_call", ({ to, offer }) => {
    io.to(to).emit("incomming_call", {
      from: socket.id,
      offer,
    });
  });
  socket.on("call_accepted", ({ to, ans }) => {
    io.to(to).emit("call_accepted", {
      from: socket.id,
      ans,
    });
  });
  socket.on("peer_nego_needed", ({ to, offer }) => {
    io.to(to).emit("peer_nego_needed", {
      from: socket.id,
      offer,
    });
  });
  socket.on("peer_nego_done", ({ to, ans }) => {
    io.to(to).emit("peer_nego_final", {
      from: socket.id,
      ans,
    });
  });
});
