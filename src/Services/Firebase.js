import * as firebase from 'firebase';

var firebaseConfig = {
    apiKey: "AIzaSyBIAV6BNTlVCRRQRCIJoXK1JffGSzJI04s",
    authDomain: "test-db-2019.firebaseapp.com",
    databaseURL: "https://test-db-2019.firebaseio.com",
    projectId: "test-db-2019",
    storageBucket: "test-db-2019.appspot.com",
    messagingSenderId: "865151129219",
    appId: "1:865151129219:web:1c061ce31159e3c8"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase;