// This webhook is to receive notifications
// from Jemin's server

import Slack from '../../services/slack'
import { createMarkdownSection } from '../../services/helpers'

const requesthookHandler = (req, res) => {
	console.log('[INFO] Received data at Requesthook Handler...')

	// TODO delete once dynamic information comes in
	const inquiry = {
		key: Date.now(),
		guest: 'Michael Scott',
		bnb: 'Total Privacy Haliburton Highlands',
		question: 'What do you mean by off-grid',
	}

	const { key, guest, bnb, question } = inquiry
	const message = `Hello :wave: *${guest}* is interested in *${bnb}* and have some questions for you!\n\nRemember to reply back by typing *_/answer ${key}_<YOUR RESPONSE>_*!`
	const formattedSlackBlock = [
		createMarkdownSection(message),
		createMarkdownSection(`*Question*: ${question}`),
	]

	Slack.postMessage(formattedSlackBlock)
		.then(result => {
			const { channel, ts, ok } = result
			const firebase = req.app.get('firebase')
			firebase.saveToFirebase(channel, key, ts, `*Question*: ${question}`)
			res.sendStatus(200)
		})
		.catch(err => console.log('[ERROR] Unable to send block to Slack', err))
}

export default requesthookHandler
