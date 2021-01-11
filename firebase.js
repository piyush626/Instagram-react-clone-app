import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCoatOmpWhUqzpHDNUcOozzK7ciIKmVD0E",
    authDomain: "insta-dome.firebaseapp.com",
    projectId: "insta-dome",
    storageBucket: "insta-dome.appspot.com",
    messagingSenderId: "263066594812",
    appId: "1:263066594812:web:69e243bfa8327a8df41679",
    measurementId: "G-MF2H4Z8ZC1"

});



  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  export {db, auth, storage};