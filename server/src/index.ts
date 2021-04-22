import EnvironmentHandler from './EnvironmentHandler';

const environmentHandler = new EnvironmentHandler('.env');
environmentHandler.setUp();

import server from './router';

server.listen(process.env['NODE_PORT'], parseInt(process.env['NODE_HOSTNAME'] ?? "3000"), () => {
    console.log(`Server running at http://${process.env['NODE_HOSTNAME']}:${process.env['NODE_PORT']}/`);
});

export default server;
