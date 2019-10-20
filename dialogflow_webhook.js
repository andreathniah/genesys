// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
const axios = require('axios');
const firebase = require('firebase');
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const endpoint = 'https://api.genesysappliedresearch.com/v2/knowledge';
const kbId = '7e0e36b6-e829-40e9-a94f-0fe8b8f66c21';
const langCode = 'en-US';
let config = {
  headers: {
    'organizationid': 'af86d224-b0d4-4bac-91fa-8a2633bad879',
    'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJvcmdJZCI6ImFmODZkMjI0LWIwZDQtNGJhYy05MWZhLThhMjYzM2JhZDg3OSIsImV4cCI6MTU3MTU4MTA2MiwiaWF0IjoxNTcxNTc3NDYyfQ.xUS7CdFZBn1NGwjILNP6nGeSJNsP-Gv0Ld0N_ZNhpOU',
    'content-type': 'application/json',
  }
};

function initFirebase() {
  const firebaseConfig = {
    apiKey: "AIzaSyD6Kj5Puu-FYKVNpHXDXc6_JQGrjIv4q9M",
    authDomain: "wunderbot-b3aa9.firebaseapp.com",
    databaseURL: "https://wunderbot-b3aa9.firebaseio.com",
  };
  firebase.initializeApp(firebaseConfig);
  return firebase.database();
}

const db = initFirebase();
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  function queryFromFirebase(key) {
    return new Promise((resolve, reject) => {
        console.log(`[FIREBASE] Querying for ${key}...`);
        db.ref(key).on('value', snapshot => {
            console.log('[FIREBASE] Found the following data:', snapshot.val());
            resolve (snapshot.val());
        });
    });
  }

  function delay() {
    return new Promise(resolve => {
      const delay = 15753;
      console.log("Preparing to wait for", delay)
      setTimeout(resolve, delay);
    })
  }

  function choosePath(faq, agent, confidence, question) {
    return new Promise((resolve, reject) => {
      console.log("STEP 1: Checking if question-answer is in knowledge base")
      if (confidence >= 0.75) {
        console.log(faq.answer)
        resolve(faq.answer)
      }
      else {
        console.log("THIS WORKS")
        const date = Date.now();
        return axios.post('http://77070840.ngrok.io/requesthook', {
          key: date,
          guest: 'Michael Scott',
          bnb: 'Total Privacy Haliburton Highlands',
          question: question,
        }).then(async(response) => {
          console.log(response.data)
          await delay()
          queryFromFirebase(date).then(data => {
            console.log(data.answer)
            const answer = data.answer;
            
            console.log("STEP 2: Create New Document")
            const createDocumentUrl = endpoint+'/knowledgebases/'+kbId+'/languages/'+langCode+'/documents/'
            console.log(createDocumentUrl)
            axios.post(createDocumentUrl, {
              "type": "faq",
              "faq": {
                "question": question,
                "answer": answer
              },
              "externalUrl": `http://test.co/info/${kbId}`
            }, config).then((response) => {
              console.log(response)
            }).catch((error) => {
              console.log(error);
            });

            console.log("STEP 3: Train knowledge base");
            const trainBaseUrl = endpoint+'/knowledgebases/'+kbId+'/languages/'+langCode+'/trainings';
            console.log(trainBaseUrl)
            axios.post(trainBaseUrl, {}, config).then((response) => {
              console.log(response)
              console.log('TRAINING KNOWLEDGE BASE')
            }).catch((err) => {
              console.log(err);
            });

            resolve(data.answer)
          }).catch((error) => {
            console.log(error)
          });
        }).catch((error) => {
          console.log(error)
        });
      }
    })
  }

  function retrieveAnswer(agent) {
    const question = agent.parameters.question;
    let urlpost = 'https://api.genesysappliedresearch.com/v2/knowledge/knowledgebases/'+kbId+'/search';
    let payload = {
      "query": question,
      "pageSize": 5,
      "pageNumber": 1,
      "sortOrder": "string",
      "sortBy": "string",
      "languageCode":"en-US",
      "documentType": "Faq"
    };
    //agent.add(`Here is your answer: ${question}`);
    return axios.post(urlpost, payload, config).then(async(response) => {
      const {results} = response.data;
      const {confidence, faq} = results[0];
      console.log(confidence)
      // agent.add(faq.answer)
      choosePath(faq, agent, confidence, question).then(result => {
        agent.add(result)
      }).catch((error) => {
        console.log(error)
      })
    }).catch((error) => {
      console.log(error)
    });  
  }

  // Run the proper function handler based on the matched Dialogflow.
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('KBQuery', retrieveAnswer);
  agent.handleRequest(intentMap);
});

