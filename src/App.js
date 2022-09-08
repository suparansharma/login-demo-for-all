import logo from './logo.svg';
import './App.css';
import { initializeApp } from 'firebase/app';
import firebaseConfig from './firebase.config';
import { GoogleAuthProvider, getAuth, signInWithPopup,signOut } from 'firebase/auth';
import { useState } from 'react';
function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: '',
  });
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const googleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const { displayName, email, photoURL } = result.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL,
        };
        setUser(signedInUser);
        console.log(displayName, email, photoURL);

        // const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential.accessToken;
        // const user = result.user;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(errorMessage);
      });

  };

  const googleSignOut = () => {
    signOut(auth)
    .then((result) => {
      // const { displayName, email, photoURL } = result.user;
      const signedOutUser = {
        isSignedIn: false,
        name: '',
        email: '',
        photo: '',
      };
      setUser(signedOutUser);
    });
  };

  return (
    <div className="App">
      {user.isSignedIn ? 
        <button onClick={googleSignOut}>Sign Out</button>
       : 
        <button onClick={googleSignIn}>Sign In</button>
      }
      {user.isSignedIn && (
        <div>
          <p>Welcome, {user.name}</p>
          <p>Your email:{user.email}</p>
          <img src={user.photo} />
        </div>
      )}
    </div>
  );
}

export default App;
