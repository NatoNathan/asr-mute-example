/**

what's in this file: 
In this file you specify a JS module with some callbacks. Basically those callbacks get calls when you receive an event from the vonage backend. There's also a 
special route function that is called on your conversation function start up allowing your to expose new local http endpoint

the event you can interract here are the same you can specify in your application: https://developer.nexmo.com/application/overview

event callbacks for rtc: 
 - rtcEvent (event, context)

event callbacks for anything else (those one are just standard express middleware access req.nexmo to get the context): 

voice callbacks 
 - voiceEvent (req, res, next)
 - voiceAnswer (req, res, next)

messages callbacks (if you specifiy one of thise, you need to declare both of them, those one are just standard express middleware access req.nexmo ):
- messagesInbound (req, res, next)
- messagesStatus (req, res, next)


route(app) // app is an express app




nexmo context: 
you can find this as the second parameter of rtcEvent funciton or as part or the request in req.nexmo in every request received by the handler 
you specify in the route function.

it contains the following: 
const {
        generateBEToken,
        generateUserToken,
        logger,
        csClient,
        storageClient
} = nexmo;

- generateBEToken, generateUserToken,// those methods can generate a valid token for application
- csClient: this is just a wrapper on https://github.com/axios/axios who is already authenticated as a nexmo application and 
    is gonna already log any request/response you do on conversation api. 
    Here is the api spec: https://jurgob.github.io/conversation-service-docs/#/openapiuiv3
- logger: this is an integrated logger, basically a bunyan instance
- storageClient: this is a simple key/value inmemory-storage client based on redis

*/



/** 
 * 
 * This function is meant to handle all the asyncronus event you are gonna receive from conversation api 
 * 
 * it has 2 parameters, event and nexmo context
 * @param {object} event - this is a conversation api event. Find the list of the event here: https://jurgob.github.io/conversation-service-docs/#/customv3
 * @param {object} nexmo - see the context section above
 * */

const DATACENTER = `https://api.nexmo.com`;
const WS_DATACENTER = `https://ws.nexmo.com`;

const path = require("path");
const words = ['mute'];

const rtcEvent = async (event, { logger, csClient }) => {
    try {
        // logger.info({event: event}, 'RTC event');
        switch (event.type) {
            case "audio:asr:done":
                const { results, call_id } = event.body.asr;
                if (results && results.map(w => w.word).some(w => words.includes(w))) {
                    //const a = await talk('Your muted', call_id, {csClient, logger});
                    await csClient({
                        url: `${DATACENTER}/v0.3/legs/${call_id}`,
                        method: 'put',
                        data: {
                            action: 'mute',
                        }
                    });
                } else {
                    await startASR(call_id, event.conversation_id, words, { csClient, logger });
                }
                return;
            case "audio:mute:on":

            default:
                return;
        }
    } catch (e) {
        logger.error({ err: e }, "RTC Error");
    }
}

const voiceAnswer = async (req, res, next) => {
    const { config } = req.nexmo;


    return res.json([
        { action: 'talk', text: 'Please wait for an agent to answer...' },
        {
            "action": "connect",
            "from": "441143597011",
            "endpoint": [
                {
                    "type": "app",
                    "user": "agent" // TODO: Need to add some logic randomly pick an available agent 
                }
            ]
        },
        // {
        //     "action": "input",
        //     "eventUrl": [
        //         `${config.server_url}/api/mute`
        //     ],
        //     "type": ["speech"],
        //     "speech": {
        //         "context": ["mute"]
        //     }
        // }
    ]);
};

const talk = async (text, uuid, nexmo) => {
    const { logger, csClient } = nexmo;
    logger.info({text: text},'Talk action');
    return await csClient({
        url: `${DATACENTER}/v0.3/legs/${uuid}/talk`,
        method: 'post',
        data: {
            text: text,
            language: 'en-US',
            voice_name: 'amy'
        }
    });
}

const startASR = async (uuid, conversation_id, speechContext, nexmo) => {
    const { logger, csClient } = nexmo;

    logger.info(`Starting ASR on leg: ${uuid}`);
    return await csClient({
        url: `${DATACENTER}/v0.3/legs/${uuid}/asr`,
        method: 'post',
        data: {
            speech_context: speechContext,
            conversation_id: conversation_id,
            active: true,
            language: 'en-GB',
            save_audio: false,
            start_timeout: 10,
            max_duration: 60,
            end_on_silence_timeout: 2.0
        }
    });
}

const voiceEvent = async (req, res, next) => {
    const { logger, csClient } = req.nexmo;
    const { status, uuid, conversation_uuid } = req.body;
    try {
        logger.info({ body: req.body }, 'Voice Event');
        if (status == 'answered') {
            logger.info('Leg answered, starting ASR on leg');
            const asr = await startASR(uuid, conversation_uuid, words, req.nexmo);
            logger.info({ asrRes: asr.body }, 'ASR stated');
        }
        res.json({})

    } catch (err) {

        logger.error("Error on voiceEvent function")
    }

}

/**
 * 
 * @param {object} app - this is an express app
 * you can register and handler same way you would do in express. 
 * the only difference is that in every req, you will have a req.nexmo variable containning a nexmo context
 * 
 */
const route = (app, express) => {
    app.use(express.static(path.join(__dirname, "public")));
    app.get("/", function (req, res) {
        res.sendFile(path.join(__dirname, "public", "index.html"));
    });

    app.post('/api/mute', async (req, res) => {
        const { csClient, logger, config } = req.nexmo;
        logger.info({ body: req.body }, 'Muting call:');
        let ncco = [];
        try {
            if (req.body.speech.results) {
                const speechResults = req.body.speech.results.map(r => r.text);
                if (speechResults.includes("mute")) {
                    const legRes = await csClient({
                        url: `${DATACENTER}/v0.3/legs/${req.body.uuid}`,
                        method: 'put',
                        data: {
                            action: 'mute',
                        }
                    });
                    ncco.push({
                        action: 'talk',
                        text: 'You are muted'
                    })
                }
            }
        } finally {
            ncco.push({
                "action": "input",
                "eventUrl": [
                    `${config.server_url}/api/mute`
                ],
                "type": ["speech"],
                "speech": {
                    "uuid": req.body.uuid,
                    "context": ["mute"]
                }
            });
            res.json(ncco);
        }
    });

    app.post('/api/ip/connect', async (req, res) => {
        const { csClient, logger, config } = req.nexmo;
        logger.info({ body: req.body }, 'IP Connect:');

        res.json([
            // {
            //     "action": "input",
            //     "eventUrl": [
            //         `${config.server_url}/api/mute`
            //     ],
            //     "type": ["speech"],
            //     "speech": {
            //         "uuid": req.body.uuid,
            //         "context": ["mute"]
            //     }
            // },
            {
                action: 'talk',
                text: 'Agent Connected'
            }
        ]);
    });



    app.get('/api/user/:username', async (req, res) => {
        const { csClient, logger } = req.nexmo;
        const { username } = req.params;
        const display = req.query.display;

        let userHref;

        try {
            const userListRes = await csClient({
                url: `${DATACENTER}/v0.3/users?name=${username}`,
                method: "GET",
            });
            const data = userListRes.data._embedded.users[0];
            userHref = data.id;
        } catch (e) {
            logger.error(e, 'User not found, make new user');
            try {
                const newUser = await csClient({
                    url: `${DATACENTER}/v0.3/users`,
                    method: 'post',
                    data: {
                        name: username,
                        display_name: display ?? username,
                    }
                });

                userHref = newUser.data.id;
            } catch (err) {
                logger.error(err, 'could not make user');
            }

        } finally {
            const userRes = await csClient({
                url: `${DATACENTER}/beta/users/${userHref}`,
                method: 'GET',
            });
            res.json(userRes.data);
        }
    });

    // app.post('/api/user/:username', async (req, res) => {
    //     const { storageClient } = req.nexmo;
    //     const {user} = req.params;

    //     console.log(storageClient);

    //     const {action} = req.body;

    //     switch (action) {
    //         case 'available':
    //             await storageClient.lpush('agents',user);
    //             res.json({});
    //             return;
    //         case 'unavailable':
    //             await storageClient.lrem('agents',user, 0);
    //             res.json({});
    //             return;
    //         default:
    //             throw new Error('Action not implemented');
    //     }

    // });

    // app.get('/api/agent', async (req, res) => {
    //     const { storageClient } = req.nexmo;

    //     const agent = await storageClient.blpop('agents');

    //     res.json({agent});
    // });

    app.post('/api/auth/login', async (req, res) => {
        const { generateUserToken } = req.nexmo;
        const username = req.body.username;

        console.log(req);

        res.json({
            user: username,
            token: generateUserToken(username),
            csapi: DATACENTER,
            ws: WS_DATACENTER
        });
    });


}



module.exports = {
    route,
    voiceAnswer,
    voiceEvent,
    rtcEvent
}
