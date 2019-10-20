import Slack from '../../services/slack'
import { createMarkdownSection } from '../../services/helpers'

const webhookHandler = async (req, res) => {
	console.log('[INFO] Received data at Webhook Handler')
	const firebase = req.app.get('firebase')

	const splitvalues = req.body.text.split('_')
	const key = splitvalues[0]
	const answer = splitvalues[1] // answer

	firebase
		.queryFirebase(key)
		.then(result => {
			console.log('[SLACK] Constructing new message block...')

			const { message, timestamp } = result
			const reply =
				`*Question*: ${message}` +
				'\nThank you for answering! We will log your response to our knowledge base :tada: :raised_hands: :100:'

			const formattedSlackBlock = [
				createMarkdownSection(reply),
				{ type: 'context', elements: [{ type: 'mrkdwn', text: `*Answered at*: ${new Date()}` }] },
			]

			console.log('[SLACK] Updating block with new messages!')
			firebase.saveToFirebase(key, { timestamp, message, answer })
			Slack.updateOldMessage(formattedSlackBlock, timestamp).then(result => console.log(result))
		})
		.catch(err => console.log('[ERROR] Unable to query Firebase for timestamp and message'))

	res.status(200).send('')
}

export default webhookHandler
