let submitData = document.getElementById("submitData");

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-analytics.js";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";
import {
  getDatabase,
  set,
  ref,
  update,
} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const database = getDatabase();

submitData.addEventListener("click", (e) => {
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      // ...
      // var date = new Date();

      // update(ref(database, 'users/' + user.uid), {
      //     last_login: date
      // })
      //     .then(() => {
      //         // Data saved successfully!
      //         //alert("user created successfully");
      //     })
      //     .catch((error) => {
      //         // The write failed...
      //         alert(error);
      //     });

      window.location.href = "index.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

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
