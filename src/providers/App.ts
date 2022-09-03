// Providers
import Express from './Express';
import MySql from './MySql';

class App {
    public startServer(): void {
        Express.Initialize();
    }

    public startDatabase(): void {
        MySql.warmup();
    }
}
export default new App();