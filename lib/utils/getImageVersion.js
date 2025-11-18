const executeShellCommand = require('./executeShellCommandLine');

module.exports = function getImageVersion() {
    return new Promise((resolve, reject) => {
        executeShellCommand(`docker inspect graphlinqchain/docker-glq-nodemanager:latest --format='{{index .Config.Labels "version"}}'`, (version) => {
            resolve(version.trim());
        }, () => {
            reject();
        }, false, console.log);
    });
}