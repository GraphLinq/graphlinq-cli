const yaml = require('yaml');
const os = require('os');
const path = require('path');

const generateDockerCompose = (options) => {
    let services = {};
    let numberOfNodes = Number(options.argv["_"][1]) || 1;
    let baseIp = 2;
    let port = options.argv.port || 8080;

    for (let i = 0; i < numberOfNodes; i++) {
        let nodeName = `node${i + 1}`;
        let volumePath = `./data/nodes/`;

        if (os.platform() === 'win32') {
            const localAppData = process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local');
            volumePath = path.join(localAppData, 'Graphlinq', 'nodes');
            // Docker don't like backslashes
            volumePath = volumePath.replace(/\\/g, '/');
        }
        services[nodeName] = {
            build: "latest",
            image: "graphlinqchain/docker-glq-nodemanager:latest",
            container_name: nodeName,
            ports: [
                `${port + i}:8080`,
                i === 0 ? `${8545}:8545` : undefined,
                i === 0 ? `${8546}:8546` : undefined,
                i === 0 ? `${8551}:8551` : undefined,
                i === 0 ? `${30310}:30310` : undefined,
                i === 0 ? `${30311}:30311` : undefined,
            ].filter((x) => x !== undefined),
            networks: {
                glqnet: { ipv4_address: `192.168.1.${baseIp + i}` }
            },
            command: "npm run prod",
            environment: {
                MANAGER_ACTIONS: JSON.stringify([])
            },
            volumes: [
                `${volumePath}:/app/nodes/`
            ]
        };
    }

    const dockerCompose = {
        services,
        networks: {
            glqnet: {
                driver: "bridge",
                ipam: { config: [{ subnet: "192.168.1.0/24" }] }
            }
        }
    };

    return yaml.stringify(dockerCompose);
};

module.exports = generateDockerCompose;