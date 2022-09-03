// Dependencies
import * as socketio from "socket.io";

// Middlewares
import Log from "../middlewares/Log";

// Routes
import Socket from "../routes/Socket";

class Sockets {
    public socket: socketio.Socket;
    private io: socketio.Server;

    constructor(io: socketio.Server) {
        if (!io) {
            Log.error("[Sockets] Failed to get IO.");
            return;
        }
        this.io = io;
        this.init();
    }

    public init(): void {
        this.io.on('connection', (sockets: socketio.Socket) => {
            this.socket = sockets;
            Socket(sockets);
            Log.debug("[Socket] Connection established.");
        })
    }
}

export default Sockets;