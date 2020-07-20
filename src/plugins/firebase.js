import firebase from 'firebase'
const config = {
    apiKey: "AIzaSyD2NoK5MGGF6mzKxOcnk3g-abHgU3EuGPY",
    authDomain: "united-base-270914.firebaseapp.com",
    databaseURL: "https://united-base-270914.firebaseio.com",
    projectId: "united-base-270914",
    storageBucket: "united-base-270914.appspot.com",
    messagingSenderId: "965773084617",
    appId: "1:965773084617:web:e68dbf8f3e5518f6dd8a18",
    measurementId: "G-PHH29VS5RG"
}

firebase.initializeApp(config);

export const db = firebase.firestore();