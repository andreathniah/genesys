export const createMarkdownSection = message => {
	return {
		type: 'section',
		text: { type: 'mrkdwn', text: message },
	}
}
