// Dependencies
import * as mysql from 'mysql2';
import * as util from 'util';

// Middlewares
import Log from '../middlewares/Log';

// Providers
import { Config, MySqlTables } from './Config';

class MySql {
    connection: mysql.Connection;
    connected: boolean;

    constructor() {
        if (Config.config().useMySql === 'true') {
            // Create the connection
            this.connection = mysql.createConnection({
                host: Config.config().mysqlHost,
                user: Config.config().mysqlUser,
                password: Config.config().mysqlPassword,
                database: Config.config().mysqlDatabase,
            });

            // Connect to the database
            this.connection.connect((err: any) => {
                if (err) {
                    Log.error(`[MySql] Connection Error: ${err.message}`);
                    return;
                }
                this.connected = true;
                Log.debug(`[MySql] Successful Connection.`);
            });
        }
    }

    public async Query(query: string, callback?: (results: any) => void) {
        if (Config.config().useMySql === 'true') {
            try {
                this.connection.execute(query, (err: any, results: any) => {
                    if (err) {
                        Log.error(`[MySql] Query Error: ${err.message}`);
                        return;
                    }
                    if (callback) callback(results);
                    return results;
                });
            } catch (error) {
                Log.error(error);
            }
        }
    }

    public async QueryAsync(queryparam: string) {
        if (Config.config().useMySql === 'true') {
            try {
                const promisql = util
                    .promisify(this.connection.query)
                    .bind(this.connection);
                const result = promisql(queryparam);
                return result;
            } catch (error) {
                Log.error(error);
            }
        }
    }

    public async QueryWithParams(
        query: string,
        params: any,
        callback?: (results: any) => void
    ) {
        if (Config.config().useMySql === 'true') {
            // Execute the query
            this.connection.execute(query, params, (err: any, results: any) => {
                if (err) {
                    Log.error(`[MySql] Query Error: ${err.message}`);
                    return;
                }
                if (callback) callback(results);
                return results;
            });
            return "MySql isn't enabled";
        }
    }

    public warmup(): void {
        if (Config.config().useMySql === 'true') {
            // Warmup the database
            Log.info(`[MySql] Warming up...`);
            // Verify the connection is alive
            this.connection.query('SELECT 1', (err: any, results: any) => {
                if (err) {
                    Log.error(`[MySql] Query Error: ${err.message}`);
                    return;
                }
                Log.info(`[MySql] Database Online.`);
            });
            // Verify the tables exist
            for (const table in MySqlTables) {
                this.connection.query(
                    `SELECT 1 FROM ${table}`,
                    (err: any, results: any) => {
                        if (err) {
                            Log.error(
                                `[MySql] Table '${table}' Not Found. Details: ${err.message}`
                            );
                            // TODO: Create tables
                            return;
                        }
                        Log.info(`[MySql] Table '${table}' Found.`);
                    }
                );
            }
        }
    }
}

export default new MySql();
