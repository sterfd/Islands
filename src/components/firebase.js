import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyCP64EJyqU0Lqivrh4BUlhqW8ob3jguiIA",
    authDomain: "islands-94307.firebaseapp.com",
    projectId: "islands-94307",
    storageBucket: "islands-94307.appspot.com",
    messagingSenderId: "786465270486",
    appId: "1:786465270486:web:96ab16672bdd858a07f777",
    measurementId: "G-S6F5WL5WKD",
    databaseURL: "https://islands-94307-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export const auth = getAuth(app);