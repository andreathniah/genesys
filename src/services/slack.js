import request from 'request'
import { OK_RESPONSE, PROD_SLACK_CHANNEL } from '../app.constants'

class Slack {
	static postMessage(formattedSlackBlock) {
		return new Promise((resolve, reject) => {
			const postOptions = {
				headers: { 'Content-type': 'application/json' },
				url: `https://slack.com/api/chat.postMessage?blocks=${encodeURIComponent(
					JSON.stringify(formattedSlackBlock)
				)}`,
				form: {
					token: process.env.SLACK_TOKEN,
					channel: PROD_SLACK_CHANNEL,
					as_user: 'false',
				},
				responseType: 'buffer',
				json: true,
			}

			request.post(postOptions, (err, res, body) => {
				if (res.statusCode === OK_RESPONSE && body.ok) resolve(body)
				else {
					console.log(err, body, res.statusCode)
					reject(err)
				}
			})
		})
	}

	static updateOldMessage(formattedSlackBlock, ts) {
		const postOptions = {
			headers: { 'Content-type': 'application/json' },
			url: `https://slack.com/api/chat.update?token=${
				process.env.SLACK_TOKEN
			}&ts=${ts}&channel=${PROD_SLACK_CHANNEL}&blocks=${encodeURIComponent(
				JSON.stringify(formattedSlackBlock)
			)}`,
			responseType: 'buffer',
			json: true,
		}

		request.post(postOptions, (err, res, body) => {
			if (res.statusCode === OK_RESPONSE && body.ok) console.log('Posted update to Slack')
			else console.log(err, body, res.statusCode)
		})
	}
}

export default Slack
