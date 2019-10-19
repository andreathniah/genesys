import express from 'express'
import bodyParser from 'body-parser'
import { PORT_LISTENER, HEALTH_PATH, WEBHOOK_PATH } from './app.constants'

// Routes
import health from './routes/health'
import webhook from './routes/webhook'

// setup apps
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const port = process.env.PORT || PORT_LISTENER

app.use(HEALTH_PATH, health)
app.use(WEBHOOK_PATH, webhook)
app.listen({ port }, () => {
	console.log(`Listening to webhooks on port ${PORT_LISTENER}`)
})
