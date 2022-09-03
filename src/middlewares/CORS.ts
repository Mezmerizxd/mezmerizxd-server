// Dependencies
import * as cors from 'cors';
import { Application } from 'express';

// Providers
import { Config } from '../providers/Config';

class CORS {
    public mount(_express: Application): Application {
        // Set the CORS options
        const options = {
            origin:
                process.env.APP_URL || `http://localhost:${process.env.PORT}`,
            optionsSuccessStatus: 200, // Some legacy browsers choke on 204
        };

        if (Config.config().isCORSEnabled === 'true') {
            //_express.use(cors(options));
            _express.use(cors());
        }
        return _express;
    }
}

export default new CORS();
