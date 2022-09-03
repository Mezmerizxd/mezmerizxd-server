// Dependencies
import { Application } from 'express';
import * as bodyParser from 'body-parser';

class Http {
    public static mount(_express: Application): Application {
        // Set the body parser options
        _express.use(
            bodyParser.json({
                limit: '50mb',
            })
        );
        _express.use(
            bodyParser.urlencoded({
                limit: '50mb',
                extended: false,
            })
        );

        _express.disable('x-powered-by');
        return _express;
    }
}

export default Http;
