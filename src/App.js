import React, { useRef, useState } from 'react';
import './App.css';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';
import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData } from 'react-firebase-hooks/firestore';



firebase.initializeApp({
  apiKey: "AIzaSyBFqdCNDPNdcAuR8M2Qprk8akOYmQ2u2rY",
  authDomain: "chat-a-fddae.firebaseapp.com",
  projectId: "chat-a-fddae",
  storageBucket: "chat-a-fddae.appspot.com",
  messagingSenderId: "129629324588",
  appId: "1:129629324588:web:6ff900cb7f385c57971889",
  measurementId: "G-B42DZ7T7TM"
})

const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();

function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
   <header>
   <h1>⚛️🔥💬</h1>
        <SignOut />
   </header>
  
    <section>
      {user ? <ChatRoom /> : <SignIn/>}
    </section>
    </div>
  );
}
function SignIn() {
  const signInWithGoogle =() =>{
      const provider = new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider);
  }
  return (
      <div>
          <button onClick={signInWithGoogle}>signInWithGoogle</button>
          <p>Do not violate the community guidelines or you will be banned for life!</p>
      </div>
  )
}

function SignOut(){
  return auth.currentUser && (
    <button onClick={()=> auth.SignOut()}>Sign Out</button>
  )
}

function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);


  const [formValue , setFormValue] = useState('')
  const [messages] = useCollectionData(query , {idField : 'id'});


  const sendMessage = async(e)=> {
    e.preventDefault();
    const {uid , photoURL} = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt : firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }
  return (
      <>
      <main>
        {messages && messages.map (msg => <ChatMessage key ={msg.id} message = {msg}/> )}
        <span ref={dummy}></span>
      </main>

      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={ (e)=> setFormValue(e.target.value)} placeholder="say something nice"/>
        <button type="submit" disabled={!formValue}>submit</button>
      </form>
      </>
  )
}


function ChatMessage(props) {
  
  const {text , Uid , photoURL} = props.message;

  const messageClass = Uid === auth.currentUser.uid ? 'sent ' : 'received';

  return (
      <div className={`message ${messageClass}`}>
        <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} alt=""/>
        <p>{text}</p>
      </div>

  )
}
export default App;


