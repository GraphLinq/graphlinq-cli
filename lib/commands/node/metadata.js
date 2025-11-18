const getPathGraphlinq = require("../../utils/getPathGraphlinq");
const fs = require("fs");
const path = require("path");

const testnetReset = (options) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pathGraphlinq = getPathGraphlinq();
            if (!pathGraphlinq) {
                reject("No path found, please start a node first");
                return;
            }
            const metadata = JSON.parse(fs.readFileSync(path.join(pathGraphlinq, 'data/node1/geth/metadata.json')).toString());
            console.log(metadata);
            resolve();
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}

module.exports = testnetReset;