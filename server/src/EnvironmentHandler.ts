import fs from 'fs';

/**
 * Class for parsing and handling environment variables.
 */
export default class EnvironmentHandler {
    /**
     * Filepath to read environment variables from.
     * @private
     */
    private readonly filePath: string;

    /**
     *
     * @param filePath of file that contains the environment variables.
     */
    public constructor(filePath: string) {
        this.filePath = filePath;
    }

    /**
     * Sets all environment variables found in the file, unless they have already been set.
     */
    public setUp() {
        if (fs.existsSync(this.filePath)) {
            const data = fs.readFileSync(this.filePath);
            data.toString().replace(/\r\n/g, '\n').split('\n').forEach((line: string) => {
                const [key, value] = line.split('=', 2);
                if (key && process.env[key] === undefined) {
                    process.env[key] = value;
                }
            })
        }
    }
}
