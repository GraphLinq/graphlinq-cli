const fs = require('fs');
const path = require('path');
const os = require('os');

const savePathGraphlinq = (pathOfExecution) => {
    const homeDir = os.homedir();
    const cliConfigPath = path.join(homeDir, '.graphlinq-cli');

    if (!fs.existsSync(cliConfigPath)) {
        fs.mkdirSync(cliConfigPath);
    }
    const pwdFilePath = path.join(cliConfigPath, 'pwd');
    fs.writeFileSync(pwdFilePath, pathOfExecution);
}

module.exports = savePathGraphlinq;