// Dependencies
import * as mongodb from 'mongodb';

// Middleware
import Log from '../middlewares/Log';

// Providers
import { Config } from '../providers/Config';

class Mongo {
    private options: any = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverApi: '1',
        connectTimeoutMS: 30000,
        keepAlive: true,
    };

    private client: any = new mongodb.MongoClient(
        Config.config().mongoDbHost,
        this.options
    );

    private stream: any;

    constructor() {
        // Create the connection
        if (Config.config().useMongoDb === 'true') {
            this.client
                .connect()
                .then((resp) => {
                    Log.debug(`[Mongo] Connection established`);
                })
                .catch((err) => {
                    Log.error(`[Mongo] Error: ${err}`);
                });
        }
    }

    private async finish(): Promise<void> {
        await this.stream.close();
        await this.client.close();
    }

    public async Query(collection: string, callback: any) {
        if (Config.config().useMongoDb === 'true') {
            try {
                await this.client.connect();
                // Get the collection
                const retCollection = this.client
                    .db(Config.config().mongoDbDatabase)
                    .collection(collection);
                // Not needed but just in case
                this.stream = retCollection.watch();
                // Return the collection to the callback
                return await callback(retCollection);
            } catch (e) {
                Log.error(`[Mongo] Error: ${e}`);
            } finally {
                await this.finish();
            }
        }
    }
}
export default new Mongo();
