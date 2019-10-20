import firebase from 'firebase'

class Firebase {
	constructor() {
		const firebaseConfig = {
			apiKey: process.env.FIREBASE_KEY,
			authDomain: process.env.FIREBASE_DOMAIN,
			databaseURL: process.env.FIREBASE_URL,
		}

		if (!firebase.apps.length) {
			console.log('[FIREBASE] Initialising Fireabase apps...')
			firebase.initializeApp(firebaseConfig)
			this.firebase = firebase.database()
		}
	}

	saveToFirebase(key, options) {
		console.log('[FIREBASE] Creating new entry...')
		this.firebase.ref(key).set(options)
	}

	queryFirebase(key) {
		return new Promise((resolve, reject) => {
			console.log(`[FIREBASE] Querying for ${key}...`)
			this.firebase.ref(key).on('value', snapshot => {
				console.log('[FIREBASE] Found the following data:', snapshot.val())
				const { message, timestamp } = snapshot.val()
				resolve({ message, timestamp })
			})
		})
	}
}

export default Firebase
