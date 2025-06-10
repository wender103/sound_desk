const firebaseConfig = {
  apiKey: "AIzaSyBsL6WpXUwh1B56fwB_t4X6b6lT-rzr-D8",
  authDomain: "spotify-75cd6.firebaseapp.com",
  projectId: "spotify-75cd6",
  storageBucket: "spotify-75cd6.appspot.com",
  messagingSenderId: "200137524316",
  appId: "1:200137524316:web:5720c562de6d6573b29299"
}
firebase.initializeApp(firebaseConfig)
const provider = new firebase.auth.GoogleAuthProvider()
const auth = firebase.auth()
const db = firebase.firestore()
const storage = firebase.storage()