const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const compression = require('compression');
const helmet = require('helmet');
const auth = require('./auth');
const config = require('./config');

const MilightController = require('./node_modules/node-milight-promise/src/index').MilightController;
const commands = require('./node_modules/node-milight-promise/src/index').commandsV6;

const light = new MilightController({
    ip: config.bridge_ip,
    type: config.bridge_version,
    delayBetweenCommands: 75,
    commandRepeat: 2
});

const zone = 0;
var lightsOn = false;

app.use(bodyParser.json());
app.use(express.json());       // to support JSON-encoded bodies
app.use(compression()); //Compress all routes
app.use(helmet());

app.post('/api/on', auth, function (req, res) {
    light.sendCommands(commands.fullColor.on(zone), commands.rgbw.on(zone), commands.white.on(zone));
    lightsOn = true;
    writeLog('Turned On');
    res.send();
});

app.post('/api/off', auth, function (req, res) {
    light.sendCommands(commands.fullColor.off(zone), commands.rgbw.off(zone), commands.white.off(zone));
    lightsOn = false;
    writeLog('Turned Off');
    res.send();
});

app.post('/api/toggle', auth, function (req, res) {
    if (lightsOn == true) {
        light.sendCommands(commands.fullColor.off(zone), commands.rgbw.off(zone), commands.white.off(zone));
        writeLog('Toggled Off');
    } else {
        light.sendCommands(commands.fullColor.on(zone), commands.rgbw.on(zone), commands.white.on(zone));
        writeLog('Toggled On');
    }

    lightsOn = !lightsOn;
    res.send();
});

app.post('/api/night', auth, function (req, res) {
    light.sendCommands(commands.fullColor.nightMode(zone));
    writeLog('Night mode');
    res.send();
});

app.post('/api/brightness', auth, function (req, res) {

    var brightness = req.query.value;

    light.sendCommands(commands.fullColor.brightness(zone, brightness), commands.rgbw.brightness(zone, brightness));
    writeLog('Brightness set to ' + brightness + '%');
    res.send();
});

function writeLog(message) {
    var datetime = new Date().toJSON();
    console.log(message + ' at ' + datetime);
}

module.exports = app;