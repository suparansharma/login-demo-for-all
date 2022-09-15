import logo from "./logo.svg";
import "./App.css";
import { initializeApp } from "firebase/app";
import firebaseConfig from "./firebase.config";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { useState } from "react";
function App() {
  const[newUser,setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn: false,
    // newUser:false,
    name: "",
    email: "",
    password: "",
    photo: "",
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
    signOut(auth).then((result) => {
      // const { displayName, email, photoURL } = result.user;
      const signedOutUser = {
        isSignedIn: false,
        name: "",
        email: "",
        photo: "",
        error:"",
        success:false

      };
      setUser(signedOutUser);
    });
  };

  const handleBlur = (event) => {
 
    let isFieldValid = true;

    if (event.target.name === "email") {
      isFieldValid = /\S+@\S+\.\S+/.test(event.target.value);
   
    }

    if (event.target.name === "password") {
      const isPasswordValid = event.target.value.length > 0;
      const passwordHasNumber = /\d{1}/.test(event.target.value);
      isFieldValid = isPasswordValid && passwordHasNumber;
 
    }

    if (isFieldValid) {
      const newUserInfo = { ...user };
      newUserInfo[event.target.name] = event.target.value;
      setUser(newUserInfo);
    }
  };

  const handleSubmit = (event) => {
    if (newUser && user.email && user.password) {
    
      const auth = getAuth();
      console.log(user.email, user.password, "subbmit");
      createUserWithEmailAndPassword(auth, user.email, user.password)
        .then(res => {
          const newUserInfo = {...user};
          newUserInfo.error="";
          newUserInfo.success=true;
          setUser(newUserInfo);
          updateUserName(user.name);
        console.log(res)
        })
        .catch((error) => {
          const newUserInfo = {...user};
          newUserInfo.error=error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
        });
    }


    if (!newUser && user.email && user.password){
      const auth = getAuth();
signInWithEmailAndPassword(auth, user.email, user.password)
  .then((userCredential) => {
    const newUserInfo = {...user};
    newUserInfo.error="";
    newUserInfo.success=true;
    setUser(newUserInfo);
  })
  .catch((error) => {
    const newUserInfo = {...user};
    newUserInfo.error=error.message;
    newUserInfo.success = false;
    setUser(newUserInfo);
  });
    }


    event.preventDefault();
  };


  const updateUserName = name =>{
    const auth = getAuth();
    updateProfile(auth.currentUser, {
      displayName: name
    }).then(function()  {
      console.log("user name updated successfully")
    }).catch(function(error) {
      console.log(error);
    });
  }

  return (
    <div className="App">
      {user.isSignedIn ? (
        <button onClick={googleSignOut}>Sign Out</button>
      ) : (
        <button onClick={googleSignIn}>Sign In</button>
      )}
      {user.isSignedIn && (
        <div>
          <p>Welcome, {user.name}</p>
          <p>Your email:{user.email}</p>
          <img src={user.photo} />
        </div>
      )}

      {/* <h1>Our Own Authentication</h1>
      <p>Email:{user.email}</p>
      <p>Password:{user.password}</p> */}
      <input type="checkbox" onChange={() =>(!setNewUser(!newUser))} name="newUser" id="" />
      <label htmlFor="newUser">New User Sign up</label>
      <form onSubmit={handleSubmit}>
       {newUser && <input type="text" onBlur={handleBlur} placeholder="Your Name" /> }<br />
        <input
          type="text"
          onBlur={handleBlur}
          name="email"
          id=""
          placeholder="Your Email addresss"
          required
        />
        <br />
        <input
          type="password"
          onChange={handleBlur}
          name="password"
          id=""
          placeholder="Your Password"
          required
        />
        <br />
        <input type="submit" value={newUser ? 'Sign up': 'Sign In'} />
      </form>
      <p style={{ color:"red" }}>{user.error}</p>
     { user.success && <p style={{ color:"green" }}>User {newUser ? 'created' : 'Logged In'} Created successfully</p>}
    </div>
  );
}

export default App;
