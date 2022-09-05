# ASR Mute Example

This is a Example of how to use NCCO to enable ASR (Automated speech recognition) to mute a conversation's participants by saying "mute me".

## Usage

Prerequisites:

1. Have [`conversation-api-function`](https://github.com/jurgob/conversation-api-function) installed
2. Have configed [`conversation-api-function`](https://github.com/jurgob/conversation-api-function)  with `conversation-api-function config-new`

Steps:

1. Clone repo
2. Install server dependencies, run `yarn`
3. Build project, run `yarn build`
4. Start Server, `yarn start`
5. Login into client and enter a username for the agent, [http://localhost:5001](http://localhost:5001)
6. Call the associated Vonage number (LVN)
7. Answer the call via the client
8. Try saying "mute me"
