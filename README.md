# Node Milight API

Node_milight is a simple API running on NodeJS with Express for controlling your Mi-Light lights. Follow the section below for an integration with Google Home and Amazon Alexa.

## Features

- Configuration file with all parameters in config.js
- Use an authentication token for securing the access to the API
- The token will be secured with an HTTPS connexion
- Control your light with a voice assistant or third-party applications

## Installation

- You will need to have [NodeJS](https://nodejs.org/en/download/) and [NPM](https://www.npmjs.com/get-npm) installed :
```shell script
sudo apt-get update 
sudo apt-get install nodejs npm
```
- Clone the repo : `git clone https://github.com/Drarox/Node_Milight_API.git`
- Go into the repo : `cd Node_Milight_API`
- Install required libraries `npm install`
- Edit config.js file `vi config.js`
- [Generate](https://www.allkeysgenerator.com/Random/Security-Encryption-Key-Generator.aspx) a good random key for authentication
- Change `bridge_ip` with your device's ip, `server_port` with the desired port (default: 3000), `authToken` with your token key and `bridge_version` if needed
- Run the server with `node server`
- You can test the API with curl or postman :
```curl
curl --location --request POST 'http://localhost:3000/api/toggle' \
--header 'Content-Type: application/json' \
--data-raw '{"auth" : "YOUR_RANDOM_TOKEN_KEY"}'
```

## API usage

Method : `HTTP POST`

Content-Type: `application/json`

Body : `{"auth" : "YOUR_RANDOM_TOKEN_KEY"}`

#### Endpoints:
- `/api/on` : Turn the lights on
- `/api/off` : Turn the lights off
- `/api/toggle` : Toggle the light on and off
- `/api/night` : Turn on night lights
- `/api/brightness?value=[0-100]` : Set the brightness to a value between 0 and 100

## Deploy as a service
- Install npm package forever : `npm install -g forever`
- Run forever : `sudo forever start server.js`

## Google Home and Alexa integration with IFTTT

For this one you will need to have a server that is always running. You will also need to open the port for your node server in your router.

I recommend to install the node server on raspberry or on a server with docker for example.
If you are one a raspberry, just open the port 3000 on your router for the raspberry or whatever port you configured your server.

#### Docker deployment
For a docker installation, I personally use the official [docker-node](https://github.com/nodejs/docker-node) image, you can use the following docker-compose :
 ```yml
node:
  image: node:lts
  user: "node"
  working_dir: /home/node/app
  environment:
    - NODE_ENV=production
  volumes:
    - /path/on/host:/home/node/app
  ports:
    - "3000:3000"
  net: bridge
  command: "npm start"
 ```
#### Server security

I strongly recommend you to use an HTTPS connection for your server because the app is using an authentication token sent in the body of the request which will only be protected if you use an HTTPS connection.

One way of doing that is to use a [reverse proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/).
With a reverse proxy you will also be able to use your domain as URL without entering the port (https://milight.example.com/api for example) and update the your ip address behind automatically using services like [ddclient](https://github.com/ddclient/ddclient).

#### IFTTT configuration

Once your server is configured, secured and the port is open, you can configure the trigger for your voice assistant in IFTTT.
Simply create an account or log in, [connect your account](https://support.google.com/pixelphone/answer/7194656) to your google account and go to [IFTTT/create](https://ifttt.com/create/), from here just click on "This" and choose the trigger plateform, for example Google Assistant and select "Say a simple phrase". Here just enter the trigger phrase and click on create trigger. Then click on "That" and search for "Webhooks" and choose "Make a web request", enter your url, for example https://milight.example.com/api/toggle, choose the method "POST", Content-Type "application/JSON" and enter this in the body section :
```json
{"auth" : "YOUR_RANDOM_TOKEN_KEY"}
```
With YOUR_RANDOM_TOKEN_KEY being the key you configured in config.js.

Finally click on "Create action" then "Finish" and that's it !

You can now trigger the light with your voice !

## Credits

- [NodeJS](https://nodejs.org/)
- [ExpressJS](https://expressjs.com/)
- [NPM](https://www.npmjs.com/get-npm)
- [node-milight-promise](https://github.com/mwittig/node-milight-promise) by Marcus Wittig

## License

Copyright (c) 2020, Yannick Burkard and contributors. All rights reserved.

[MIT License](https://github.com/Drarox/Node_Milight_API/blob/master/LICENSE)
