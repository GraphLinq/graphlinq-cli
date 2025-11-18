const containerIsRunning = require("../../container/container-is-running");
const containerExec = require("../../container/container-exec");

function stop(options) {
    return new Promise(async (resolve, reject) => {
        const isRunning = await containerIsRunning();
        if (!isRunning) {
            reject('Container is not running');
            return;
        }

        const output = await containerExec(['cat', '/app/nodes/.password']);

        if (output.includes('No such file or directory')) {
            reject('Node not configured');
            return;
        }
        const password = output.trim();

        if (password == '') {
            reject('Node not configured - Login failed');
            return;
        }

        let isRunningResult = await fetch('http://localhost:8080/test', {
            method: 'GET',
            headers: {
                'Access-Code': password,
                'Content-Type': 'application/json'
            }
        });

        if (isRunningResult.status != 200) {
            reject('Node not configured - Is setup failed', isRunningResult.status);
            return;
        }

        const testData = await isRunningResult.json();
        if (!testData) {
            reject('Node not configured - Is setup failed', isRunningResult.status);
            return;
        }

        for (let i = 1; i < 2; i++) {
            if (testData['node' + i].status == '0') {
                continue;
            }
            let result = await fetch('http://localhost:8080/node' + i + '-kill', {
                method: 'POST',
                headers: {
                    'Access-Code': password,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            });

            if (result.status != 200) {
                reject('Failed to stop node ' + i + ' - ' + result.status);
                return;
            }
        }

        resolve();
    });
};

module.exports = stop;