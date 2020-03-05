const config = {};

//The ip of your bridge
config.bridge_ip = "192.168.1.1"; // 255.255.255.255 for broadcast

//Bridge version
config.bridge_version = "v6"; //v4 (old) or v6 (new)

//Desired server port
config.server_port = 3000;

//Generated token
config.authToken = 'YOUR_RANDOM_TOKEN_KEY';

module.exports = config;