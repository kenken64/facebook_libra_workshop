import firebase from "firebase";

var firebaseConfig = {
  apiKey: "AIzaSyDeca5K26DxHVzrAUpVsEgj2kjTM_7q_SI",
  authDomain: "libra-wallet-28877.firebaseapp.com",
  databaseURL: "https://libra-wallet-28877.firebaseio.com",
  projectId: "libra-wallet-28877",
  storageBucket: "libra-wallet-28877.appspot.com",
  messagingSenderId: "903414187806",
  appId: "1:903414187806:web:64caddd73c331806"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default firebase;
