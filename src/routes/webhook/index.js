import Slack from '../../services/slack'
import { createMarkdownSection } from '../../services/helpers'

const webhookHandler = async (req, res) => {
	console.log('[INFO] Received data at Webhook Handler')
	const firebase = req.app.get('firebase')

	const { channel_id, text } = req.body
	const splitvalues = text.split('_')
	const key = splitvalues[0]
	const reply = splitvalues[1]

	firebase
		.queryFirebase(channel_id, key)
		.then(result => {
			const { message, timestamp } = result
			const reply =
				message +
				'\nThank you for answering! We will log your response to our knowledge base :tada::raised_hands::100:'

			const formattedSlackBlock = [
				createMarkdownSection(reply),
				{ type: 'context', elements: [{ type: 'mrkdwn', text: `*Answered at*: ${new Date()}` }] },
			]

			console.log('[SLACK] Updating Slack Block with new messages!')
			Slack.updateOldMessage(formattedSlackBlock, timestamp).then(result => console.log(result))
			res.status(200).send('')
		})
		.catch(err => console.log('[ERROR] Unable to query Firebase for timestamp and message'))
}

export default webhookHandler
