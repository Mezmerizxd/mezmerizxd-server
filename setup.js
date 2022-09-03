try {
    // Make sure Node is installed
    if (typeof module === 'undefined') {
        throw new Error('Node.js is not installed');
    }

    // Make sure the user is using node version 16.x
    if (process.version.slice(1).split('.')[0] < 16) {
        console.log(
            'You are using Node ' +
                process.version +
                ', but this app requires Node ' +
                '16.x. Please upgrade your Node installation to use this app.'
        );
        process.exit(1);
    } else {
        console.log(
            '\x1b[32mNode version ' +
                process.version +
                ' found. Continuing.\x1b[0m'
        );
    }

    // Install yarn
    console.log('\x1b[36mInstalling yarn...\x1b[0m');
    require('child_process').execSync(
        'npm install -g yarn',
        (err, stdout, stderr) => {
            if (err) {
                console.log('Error installing yarn: ' + err + stderr);
                process.exit(1);
            } else {
                console.log(stdout);
            }
        }
    );
    console.log('\x1b[32mYarn installed.\x1b[0m');

    // Install dependencies
    console.log('\x1b[36mInstalling dependencies...\x1b[0m');
    require('child_process').execSync('yarn install', (err, stdout, stderr) => {
        if (err) {
            console.log('Error installing dependencies: ' + err + stderr);
            process.exit(1);
        } else {
            console.log(stdout);
        }
    });
    console.log('\x1b[32mDependencies installed.\x1b[0m');

    // Run the app
    console.log('\x1b[36mBuilding the app...\x1b[0m');
    require('child_process').execSync('yarn build', (err, stdout, stderr) => {
        if (err) {
            console.log('Error building the app: ' + err + stderr);
            process.exit(1);
        } else {
            console.log(stdout);
        }
    });

    // require("child_process").exec('yarn start', (err, stdout, stderr) => {
    //     if (err) {
    //         console.log('Error starting the project: ' + err + stderr);
    //         process.exit(1);
    //     }
    //     console.log(stdout);
    // });
    // console.log('\x1b[32mApp running.\x1b[0m');

    // Tell user how to start it
    console.log('\x1b[36mTo start the app, run: yarn start\x1b[0m');
} catch (error) {
    console.log(error);
    return;
}
