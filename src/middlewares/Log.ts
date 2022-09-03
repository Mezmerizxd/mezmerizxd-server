// Dependencies
import * as fs from 'fs';

class Log {
    public info(string: string, log?: boolean) {
        const fString = `[${new Date().toLocaleString()}] [INFO] ${string}`;
        console.log(`\x1b[32m${fString}\x1b[0m`);
        if (!log) this.LogToFile(fString);
    }

    public warn(string: string, log?: boolean) {
        const fString = `[${new Date().toLocaleString()}] [WARN] ${string}`;
        console.log(`\x1b[33m${fString}\x1b[0m`);
        if (!log) this.LogToFile(fString);
    }

    public error(string: string, log?: boolean) {
        const fString = `[${new Date().toLocaleString()}] [ERROR] ${string}`;
        console.log(`\x1b[31m${fString}\x1b[0m`);
        if (!log) this.LogToFile(fString);
    }

    public debug(string: string, log?: boolean) {
        const fString = `[${new Date().toLocaleString()}] [DEBUG] ${string}`;
        console.log(`\x1b[36m${fString}\x1b[0m`);
    }

    private LogToFile(string: string) {
        const logFilePath = `logs/${new Date()
            .toISOString()
            .replace(/T.*/, '')
            .split('-')
            .reverse()
            .join('-')}.log`;
        // Create the Folder if it doesn't exist
        if (!fs.existsSync(`logs`)) {
            fs.mkdirSync(`logs`);
        }
        // Create the file if it doesn't exist
        if (!fs.existsSync(logFilePath)) {
            fs.writeFileSync(logFilePath, '');
        }
        // Append the data to the file
        fs.appendFileSync(logFilePath, string + '\n');
    }
}

export default new Log();
