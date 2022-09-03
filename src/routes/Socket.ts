// Dependencies
import * as socketio from "socket.io";

// Controllers
import TestController from "../controllers/test-controller";

function Socket(socket: socketio.Socket): void {
    socket.on("disconnect", TestController.socket);
}
export default Socket;
