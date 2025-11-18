const ora = require('ora');
const path = require("path");
const fs = require('fs');
const os = require('os');
const executeMultipleShellCommand = require('../utils/executeMultipleShellCommand');
const executeShellCommand = require('../utils/executeShellCommandLine');
const generateDockerCompose = require('../utils/generateDockerCompose');
const stop = require('./stop');
const getPathGraphlinq = require('../utils/getPathGraphlinq');

function cmds() {

    let failed = false;

    const graphlinqPath = getPathGraphlinq();
    if (!graphlinqPath) {
        failure("No path found, please start a node first");
        return;
    }

    let volumePath = path.join(graphlinqPath, 'data');

    var array = [
        { // check docker
            cond: () => !failed,
            cmd: (success, failure) => {
                try {
                    if (fs.existsSync(volumePath)) {
                        fs.rmSync(volumePath, { recursive: true, force: true });
                    }
                    success();
                } catch(e) { failure(e) }
            }
        },
        {
            cmd: (success, failure) => {
                try {
                    options.argv.remove = "true";
                    stop(options).then(() => {
                        success();
                    }).catch((e) => {
                        failure(e);
                    });
                } catch(e) { failure(e) }
            }
        }
    ]

    return array;
}

function start(options) {
    return new Promise((resolve, reject) => {
        const exeCmds = cmds();
        executeMultipleShellCommand(exeCmds, 0, executeMultipleShellCommand, () => {
            ora("NodeManager reset successfully").succeed();
            resolve(undefined);
        });
    });
};

module.exports = start;