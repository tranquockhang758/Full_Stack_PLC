import { Server } from "socket.io";
let PORT = process.env.PORT_WEBSOCKET || 9000;
const io = new Server(PORT);

io.on("connect", (socket) => {
  console.log(`connect ${socket.id}`);

  socket.on("ping", (cb) => {
    console.log("ping");
    cb();
  });

  socket.on("disconnect", () => {
    console.log(`disconnect ${socket.id}`);
  });
});
