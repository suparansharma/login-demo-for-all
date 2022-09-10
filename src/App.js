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


  const handleBlur =(event) =>{
  console.log(event.target.name,event.target.value);
  if(event.target.name==='email'){
    const isEmailValid = /\S+@\S+\.\S+/.test(event.target.value);
    console.log(isEmailValid);
  }

  if(event.target.name==='password'){
    const isPasswordValid = event.target.value.length>0;
    const isEmailValid = /\d{1}/.test(event.target.value);
    console.log(isPasswordValid,isEmailValid);
  }
  }

  const handleSubmit = () =>{

  }

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


    <h1>Our Own Authentication</h1>
    <form onSubmit={handleSubmit}>
      <input type="text" onBlur={handleBlur} name="email" id="" placeholder='Your Email addresss' required /><br />
      <input type="password" onChange={handleBlur} name="password" id="" placeholder='Your Password' required /><br />
      <input type="submit" value="submit" />
    </form>


    </div>
  );
}

export default App;
