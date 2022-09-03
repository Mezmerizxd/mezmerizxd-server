// Middlewares
import Log from '../middlewares/Log';

class NativeEvent {
    public cluster(_cluster): void {
        // Catch the cluster's listening port
        _cluster.on('listening', (worker: any, address: any) => {
            Log.info(
                `[NativeEvent] Worker ${worker.process.pid} is listening on port ${address.port}`
            );
        });
        // Catch the cluster when it is back online
        _cluster.on('online', (worker: any) => {
            Log.info(`[NativeEvent] Worker ${worker.process.pid} is online`);
        });
        // Catch the cluster when it goes offline
        _cluster.on('offline', (worker: any) => {
            Log.info(`[NativeEvent] Worker ${worker.process.pid} is offline`);
        });
        // Catch the cluster when it is exiting
        _cluster.on('exit', (worker: any, code: any, signal: any) => {
            Log.info(
                `[NativeEvent] Worker ${worker.process.pid} is exiting with code ${code} and signal ${signal}`
            );
            _cluster.fork();
        });
    }

    public process(): void {
        // Catch the Process's uncaught-exception
        process.on('uncaughtException', (exception: any) =>
            Log.error(exception.stack)
        );

        // Catch the Process's warning event
        process.on('warning', (warning: any) => Log.warn(warning.stack));
    }
}
export default new NativeEvent();
