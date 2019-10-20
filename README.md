# Dialogflow webhook

`dialogflow_webhook.js` is a webhook that allows the dialogflow chatbot to make api calls to the knowledgebase to retrieve answers.

## Set-up Steps

1. Simply spin up your own dialogflow chatbot and paste the code under Fulfillments -> Inline Editor. 
2. Once done, make sure you create a knowledgebase, upload the necessary documents and train the knowledgebase before attempting to ask questions through your dialogflow chatbot.
3. When a question is asked on your dialogflow chatbot, if the answer returned is above a certain threshold (default value = 0.75), the bot will display the answer that best fits the question. If the answer falls below the threshold, the webhook will make a call to an agent on Slack. The agent will then be able to key in the correct response for the question. This will trigger the `create document` and `train knowledgebase` api on Genesys. 
4. After waiting for ~2-3mins (depending on how long it takes to retrain the knowledgebase), the user will be able to ask the same question without the agent having to reply because the answer has already been added into the knowledgebase.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)