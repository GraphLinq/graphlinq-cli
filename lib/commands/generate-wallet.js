const ora = require('ora');
const executeMultipleShellCommand = require('../utils/executeMultipleShellCommand');
const ethers = require('ethers');

function cmds() {
    var array = [
        {
            cmd: (success, failure) => {
                const wallet = ethers.Wallet.createRandom();

                console.log(`Private Key    : ${wallet.privateKey}`);
                console.log(`Address        : ${wallet.address}`);
                success();
            }
        },
    ]

    return array;
}

function generateWallet(options) {
    return new Promise((resolve, reject) => {
        const exeCmds = cmds();
        executeMultipleShellCommand(exeCmds, 0, executeMultipleShellCommand, () => {
            ora("Wallet generated successfully").succeed();
            resolve(undefined);
        });
    });
};

module.exports = generateWallet;