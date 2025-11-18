const getPathGraphlinq = require('../utils/getPathGraphlinq');

const pwd = () => {
    return new Promise((resolve, reject) => {
        const pathGraphlinq = getPathGraphlinq();
        if (!pathGraphlinq) {
            reject("No path found, please start a node first");
            return;
        }
        console.log(pathGraphlinq);
        resolve();
    });
}

module.exports = pwd;