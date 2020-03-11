const request = require('request')
const jsonwebtoken = require('jsonwebtoken');

const serverTokenDurationSec = 12345;
const user_id = ""
const client_id = "ob69ek1x0m4r98thcr753xdszt7oll";
const channel_id = "265737932" // "470972377"
const secret = "oUWvJv34GGHwsngqPpRXSeeB2uJa93NrYA3PilEDWXg"
// Use verbose logging during development.  Set this to false for production.
const verboseLogging = true;
const verboseLog = verboseLogging ? console.log.bind(console) : () => { };
const bearerPrefix = 'Bearer ';             // HTTP authorization headers have this prefix

const STRINGS = {
    secretEnv: usingValue('secret'),
    clientIdEnv: usingValue('client-id'),
    serverStarted: 'Server running at %s',
    secretMissing: missingValue('secret', 'EXT_SECRET'),
    clientIdMissing: missingValue('client ID', 'EXT_CLIENT_ID'),
    cyclingColor: 'Cycling color for c:%s on behalf of u:%s',
    sendColor: 'Sending color %s to c:%s',
    invalidAuthHeader: 'Invalid authorization header',
    invalidJwt: 'Invalid JWT'
  };

function usingValue (name) {
    return `Using environment variable for ${name}`;
}

function missingValue (name, variable) {
    const option = name.charAt(0);
    return `Extension ${name} required.\nUse argument "-${option} <${name}>" or environment variable "${variable}".`;
  }

// generate a signed JWT.
function genServerToken() {
  const payload = {
    exp: Math.floor(Date.now() / 1000) + serverTokenDurationSec,
    user_id: user_id, 
    role: 'external',
    pubsub_perms: {
      send: ['*'],
    },
  };
  return jsonwebtoken.sign(payload, secret, { algorithm: 'HS256' });
}

function fetchGlobalConfig() {

    const headers = {
      'Client-ID': client_id,
      'Content-Type': 'application/json',
      'Authorization': bearerPrefix + genServerToken(),
    };

    request(
      `https://api.twitch.tv/extensions/${client_id}/configurations/segments/global`,
      {
        method: 'GET',
        headers: headers
      }
      , (err, res) => {
        if (err) {
          console.log(STRINGS.messageSendError, err);
        } else {
            console.log(res)
            let respBody = JSON.parse(res.body);
            let globalConfig = respBody["global:"];
            let content = globalConfig.record.content;
            console.log(content);
        }
      });
}

function setGlobalConfig() {
    const headers = {
      'Client-ID': client_id,
      'Content-Type': 'application/json',
      'Authorization': bearerPrefix + genServerToken(),
    };

    const payload = JSON.stringify({
        "segment":"global",
        "content":{"foo":"bar"}
    });

    request(
      `https://api.twitch.tv/extensions/${client_id}/configurations/`,
      {
        method: 'PUT',
        headers: headers,
        body: payload
      }
      , (err, res) => {
        if (err) {
          console.log(STRINGS.messageSendError, err);
        } else {
          console.log(res);
          verboseLog(STRINGS.pubsubResponse, res.statusCode);
        }
      });
}

async function main () {
    const token = genServerToken()
    console.log(token)
    
    setGlobalConfig()
    fetchGlobalConfig()
}

main()
