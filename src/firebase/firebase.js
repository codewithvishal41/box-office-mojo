
import { initializeApp } from "firebase/app";
import {getFirestore,collection} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCR5LEWSw6Bx_cL6ipdc4rdsXZdG_D5pnw",
  authDomain: "box-office-mojo-ce03f.firebaseapp.com",
  projectId: "box-office-mojo-ce03f",
  storageBucket: "box-office-mojo-ce03f.appspot.com",
  messagingSenderId: "1081793169961",
  appId: "1:1081793169961:web:2a91612b3ce1f1ccfc6a38"
};

const app = initializeApp(firebaseConfig);

export const db=getFirestore(app);
export const moviesRef= collection(db,"movies")
export const reviewsRef= collection(db,"reviews")
export const usersRef= collection(db,"users")
export default app;
