// Dependencies
import * as path from 'path';
import * as express from 'express';
import * as fs from 'fs';
import * as exec from 'child_process';

// Providers
import { Config } from '../providers/Config';

// Middlewares
import Log from '../middlewares/Log';

class Statics {
    public static mount(_express: express.Application): express.Application {
        // Set the static web folder
        this.Initialize();
        _express.use(
            express.static(
                path.join(
                    __dirname,
                    Config.config().useGithub === 'true'
                        ? `../../build/${Config.config().githubRepoName}`
                        : '../../demo'
                )
            )
        );
        return _express;
    }

    private static Initialize(): void {
        // Install/Update the static web repository
        if (Config.config().useGithub === 'true') {
            this.installFromGithubBranch();
        }
    }

    private static installFromGithubBranch() {
        // Check build folder exists
        if (!fs.existsSync(path.join(__dirname, '../../build'))) {
            fs.mkdirSync(path.join(__dirname, '../../build'));
        }
        // Check the web repository exists
        if (
            !fs.existsSync(
                path.join(
                    __dirname,
                    `../../build/${Config.config().githubRepoName}`
                )
            )
        ) {
            Log.info(
                `[Statics] Cloning ${
                    Config.config().githubRepoName
                } repository...`
            );
            // Clone the repository
            exec.execSync(
                `cd ${path.join(__dirname, '../../build')} && git clone ${
                    Config.config().staticWebRepoUrl
                }`
            );
        }
        // Update the web repository
        Log.info(`[Statics] Updating ${Config.config().githubRepoName}...`);
        try {
            // Update the repository
            exec.execSync(
                `cd ${path.join(
                    __dirname,
                    `../../build/${Config.config().githubRepoName}`
                )} && git pull`
            );
            // Switch to build branch
            // check if asset-manifest file exists
            if (
                !fs.existsSync(
                    path.join(
                        __dirname,
                        `../../build/${
                            Config.config().githubRepoName
                        }/asset-manifest.json`
                    )
                )
            ) {
                Log.info(
                    `[Statics] Switching to branch ${
                        Config.config().githubRepoBranch
                    }...`
                );
                // Switch to build branch
                exec.execSync(
                    `cd ${path.join(
                        __dirname,
                        `../../build/${Config.config().githubRepoName}`
                    )} && git checkout ${Config.config().githubRepoBranch}`
                );
            }
        } catch (error) {
            try {
                Log.info(
                    `[Statics] Deleting ${
                        Config.config().githubRepoName
                    } repository...`
                );
                exec.execSync(
                    `cd ${path.join(__dirname, '../../build')} && rm -rf ${
                        Config.config().githubRepoName
                    }`
                );
                this.installFromGithubBranch();
            } catch (error) {
                Log.error(`[Statics] ${error}`);
                return;
            }
        }
    }
}

export default Statics;
