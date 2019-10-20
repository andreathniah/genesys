import Slack from '../../services/slack'
import { createMarkdownSection } from '../../services/helpers'

const requesthookHandler = (req, res) => {
	console.log('[INFO] Received data at Requesthook Handler...')
	console.log(req.body, '\n')

	const { key, guest, bnb, question } = req.body
	const message = `Hello :wave: *${guest}* is interested in *${bnb}* and have some questions for you!\n\nRemember to reply back by typing *_/answer ${key}_<YOUR RESPONSE>_*!`
	const formattedSlackBlock = [
		createMarkdownSection(message),
		createMarkdownSection(`*Question*: ${question}`),
	]

	console.log(formattedSlackBlock)
	Slack.postMessage(formattedSlackBlock)
		.then(result => {
			console.log('CURRENTLY IN POSTING MESSAGE')
			console.log(result)
			const { ts } = result
			const firebase = req.app.get('firebase')
			firebase.saveToFirebase(key, { timestamp: ts, message: question })
		})
		.catch(err => console.log('[ERROR] Unable to send block to Slack', err))

	res.sendStatus(200)
}

export default requesthookHandler
