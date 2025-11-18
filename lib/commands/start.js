const ora = require('ora');
const path = require("path");
const fs = require('fs');
const executeMultipleShellCommand = require('../utils/executeMultipleShellCommand');
const executeShellCommand = require('../utils/executeShellCommandLine');
const generateDockerCompose = require('../utils/generateDockerCompose');
const savePathGraphlinq = require('../utils/savePathGraphlinq');
const getPathGraphlinq = require('../utils/getPathGraphlinq');

function cmds(options) {

    let failed = false;

    var array = [
        { // generate docker compose
            cmd: (success, failure) => {
                try {
                    let pathGraphlinq = getPathGraphlinq();
                    if (!pathGraphlinq) {
                        pathGraphlinq = process.cwd();
                    }
                    const dockerComposeFileContent = generateDockerCompose(options);
                    fs.writeFileSync(path.join(pathGraphlinq, `docker-compose.yml`), dockerComposeFileContent);
                    ora(`docker-compose.yml generated successfully`).succeed();
                    success();
                } catch(e) {
                    console.log(e);
                    failed = true;
                    failure(e)
                }
            }
        },
        { // check docker
            cond: () => !failed,
            cmd: (success, failure) => {
                try {
                    const pathGraphlinq = getPathGraphlinq();
                    if (!pathGraphlinq) {
                        executeShellCommand("docker compose up -d", async (stdout) => {
                            savePathGraphlinq(process.cwd());
                            success();
                        }, () => {
                            failure("Docker compose up failed");
                        }, false, console.log);
                    } else {
                        executeShellCommand("docker compose --project-directory=\"" + pathGraphlinq + "\" up -d", async (stdout) => {
                            success();
                        }, () => {
                            failure("Docker compose up failed");
                        }, false, console.log);
                    }
                    
                } catch(e) { failure(e) }
            }
        },
    ]

    return array;
}

function start(options) {
    return new Promise((resolve, reject) => {
        let numberOfNodes = Number(options.argv["_"][1]) || 1;

        if (numberOfNodes > 5) {
            reject("Number of nodes must be less than 5");
            return;
        }

        const exeCmds = cmds(options);
        executeMultipleShellCommand(exeCmds, 0, executeMultipleShellCommand, () => {
            ora(`NodeManager started successfully you can access it at http://0.0.0.0:${options.argv.port || 8080}`).succeed();
            resolve(undefined);
        });
    });
};

module.exports = start;