# ChatBoT

## Freedom FAQ Scraper

`script/freedom_cleaner.js` is a script that parse HTML strings (intercepted at Network calls) to DOM element and clean necessary data required for Dialogflow.

## Dialogflow webhook

`scripts/dialogflow_webhook.js` is a webhook that allows the dialogflow chatbot to make api calls to the knowledgebase to retrieve answers.

### Set-up Steps

1. Simply spin up your own dialogflow chatbot and paste the code under Fulfillments -> Inline Editor.
2. Once done, make sure you create a knowledgebase, upload the necessary documents and train the knowledgebase before attempting to ask questions through your dialogflow chatbot.
3. When a question is asked on your dialogflow chatbot, if the answer returned is above a certain threshold (default value = 0.75), the bot will display the answer that best fits the question. If the answer falls below the threshold, the webhook will make a call to an agent on Slack. The agent will then be able to key in the correct response for the question. This will trigger the `create document` and `train knowledgebase` api on Genesys.
4. After waiting for ~2-3mins (depending on how long it takes to retrain the knowledgebase), the user will be able to ask the same question without the agent having to reply because the answer has already been added into the knowledgebase.

## Slack integration server

This is a web server that forwards `Questions` from Dialogflow to the customer support agent on Slack, waits for their `Answers` and send them back to Dialogflow.

### Set-up Steps

1. Install the dependencices at root folder with `yarn`
2. Start the server with `yarn start`
3. Set up Slack API with `chat:write:bot` scope and `Interactive Components` enabled

## Authors

- [@andreathniah](https://github.com/andreathniah)
- [@kangmingtay](https://github.com/kangmingtay)
- [@jeminsieow](https://github.com/jeminsieow)
