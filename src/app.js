import express from 'express'
import bodyParser from 'body-parser'
import { PORT_LISTENER, HEALTH_PATH, WEBHOOK_PATH, REQUESTHOOK_PATH } from './app.constants'

// Routes
import health from './routes/health'
import webhook from './routes/webhook'
import requesthook from './routes/requesthook'
import Firebase from './services/firebase'

// setup apps
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Services
const firebase = new Firebase()
app.set('firebase', firebase)

const port = process.env.PORT || PORT_LISTENER

app.use(HEALTH_PATH, health)
app.use(WEBHOOK_PATH, webhook) // to interact with Slack
app.use(REQUESTHOOK_PATH, requesthook) // to listen to KM's server
app.listen({ port }, () => {
	console.log(`Listening to webhooks on port ${PORT_LISTENER}`)
})
