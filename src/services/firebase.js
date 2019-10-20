import firebase from 'firebase'

class Firebase {
	constructor() {
		const firebaseConfig = {
			apiKey: process.env.FIREBASE_KEY,
			authDomain: process.env.FIREBASE_DOMAIN,
			databaseURL: process.env.FIREBASE_URL,
		}

		if (!firebase.apps.length) {
			console.log('Initialising Fireabase apps...')
			firebase.initializeApp(firebaseConfig)
			this.firebase = firebase.database()
		}
	}

	saveToFirebase(channel_id, key, timestamp, message) {
		this.firebase.ref(`${channel_id}/${key}`).set({ message, timestamp })
	}

	queryFirebase(channel_id, key) {
		return new Promise((resolve, reject) => {
			console.log(`Finding ${channel_id}/${key}...`)
			this.firebase.ref(`${channel_id}/${key}`).on('value', snapshot => {
				console.log('Found the following data:', snapshot.val())
				const { message, timestamp } = snapshot.val()
				resolve({ message, timestamp })
			})
		})
	}
}

export default Firebase
