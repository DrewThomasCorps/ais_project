import EnvironmentHandler from './EnvironmentHandler';

const environmentHandler = new EnvironmentHandler('.env');
environmentHandler.setUp();

const server = require('./router.ts');

server.listen(process.env['NODE_PORT'], process.env['NODE_HOSTNAME'], () => {
    console.log(`Server running at http://${process.env['NODE_HOSTNAME']}:${process.env['NODE_PORT']}/`);
});
