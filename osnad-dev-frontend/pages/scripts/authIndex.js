let submitData = document.getElementById("submitData");
console.log(submitData);
// Import the functions you need from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-analytics.js";
import {
  getAuth,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";

// Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyAbU0rJQS3fI_FQ2EMHJ3wh5JkXi5cb73I",
  authDomain: "osn-analysis.firebaseapp.com",
  databaseURL:
    "https://osn-analysis-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "osn-analysis",
  storageBucket: "osn-analysis.appspot.com",
  messagingSenderId: "579632718219",
  appId: "1:579632718219:web:eb7c1044db184255624f8e",
  measurementId: "G-BKHM040NRF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();

submitData.addEventListener("click", (e) => {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      window.location.href = "login.html";
    })
    .catch((error) => {
      // An error happened.
        if (errorCode == "auth/invalid-email") {
          alert("Invalid email address");
        } else if (errorCode == "auth/wrong-password") {
          alert("Wrong Password");
        } else if (errorCode == "auth/user-not-found") {
          alert("User not found");
        } else if (errorCode == "auth/weak-password") {
          alert("Password must be over 6 characters");
        } else {
          alert(errorMessage);
        }
    });
});
