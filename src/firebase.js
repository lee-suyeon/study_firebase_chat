import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

 // Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: "AIzaSyAMoKAdKUnJ0Y5IFe60PJR66Ea0P8JOi2o",
    authDomain: "react-firebase-chat-app-1e4fd.firebaseapp.com",
    projectId: "react-firebase-chat-app-1e4fd",
    storageBucket: "react-firebase-chat-app-1e4fd.appspot.com",
    messagingSenderId: "430963652782",
    appId: "1:430963652782:web:31edc65f287af699a6953f",
    measurementId: "G-8GHTYZ8WHH"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  // firebase.analytics(); 구글애널리틱스