// Dependencies
import * as express from 'express';
import * as http from 'http';
import * as socketio from "socket.io";

// Providers
import Routes from './Routes';
import { Config } from './Config';
import MySql from './MySql';
import Socket from "./Sockets";

// Middlewares
import Kernal from '../middlewares/Kernel';
import Log from '../middlewares/Log';

class Express {
    public express: express.Application;
    public httpServer: http.Server;
    public io: socketio.Server;

    constructor() {
        this.express = express();

        this.startHttp();
        this.startSocketIO();

        // Get the environment variables
        this.mountDotEnv();
        // Mount the middlewares
        this.mountMiddlewares();
        // Mount the routes
        this.mountRoutes();
        // Initialize the database
        MySql.warmup();
        //this.socketServer.init();
    }

    private mountDotEnv(): void {
        // Load the .env file
        this.express = Config.Initialize(this.express);
    }

    private mountMiddlewares(): void {
        // Mount the Kernal middleware
        this.express = Kernal.Initialize(this.express);
    }

    private mountRoutes(): void {
        // Mount the static web
        this.express = Routes.mountWeb(this.express, express);
        this.express = Routes.mountApi(this.express, express);
    }

    private startHttp(): void {
        this.httpServer = new http.Server(this.express);
    }

    private startSocketIO(): void {
        this.io = new socketio.Server(this.httpServer, {cors: { origin: '*', methods: 'GET,HEAD,PUT,PATCH,POST,DELETE' }});
        new Socket(this.io);
    }

    public Initialize(): any {
        this.httpServer
            .listen(Config.config().port, () => {
                Log.debug(
                    `[Server] running on http://localhost:${
                        Config.config().port
                    }`,
                    false
                );
            })
            .on('error', (err) => {
                console.log('Error:', err.message);
                Log.error(`${err}`);
            });
    }
}
export default new Express();
