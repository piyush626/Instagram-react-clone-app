import React, { useState, useEffect } from 'react'
import './App.css';
import Post from "./Post"
import {db, auth} from "./firebase"
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [modalStyle] = useState(getModalStyle);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);
  const [openSignIn, setOpenSignIn] = useState(false);

  useEffect(()=> {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser){
        // logged in...
        console.log(authUser);
        setUser(authUser);
      }
      else{
        //logged out...
        setUser(null);
      }
    })

  return () => {
    //perform some clean up actions
    unsubscribe();
  }

  }, [user, username]);

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'asc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id:doc.id,
        post:doc.data()
      })));
    })

  }, []);

  const signUp = (e) => {
    e.preventDefault();
    auth
    .createUserWithEmailAndPassword(email,password)
    .then((authUser)=> {
      return authUser.user.updateProfile({
        displayName:username
      })
    })
    .catch((error)=> alert(error.message));

    setOpen(false);
  }

  const signIn = (e) => {
    e.preventDefault();
    auth
    .signInWithEmailAndPassword(email,password)
    .catch((error)=> alert(error.message));
    
    setOpenSignIn(false);
  }


  return (
    <div className="app">
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
             <form className="app__signup">
                <center>
                  <img 
                    className="app__headerImage"
                    height="70px;"
                    src="https://github.com/piyush626/photos/blob/main/instaone.png?raw=true"
                    alt=""
                  />
                </center>
                <Input 
                  type="text"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                /> 
                <Input 
                  placeholder="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input 
                  placeholder="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button type="submit" onClick={signUp}>Sign Up</Button>
              </form>
        </div>
      </Modal>



      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
             <form className="app__signup">
                <center>
                  <img 
                    className="app__headerImage"
                    height="70px;"
                    src="https://github.com/piyush626/photos/blob/main/instaone.png?raw=true"
                    alt=""
                  />
                </center>
                <Input 
                  placeholder="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input 
                  placeholder="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button type="submit" onClick={signIn}>Sign In</Button>
              </form>
        </div>
      </Modal>


      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://github.com/piyush626/photos/blob/main/instaone.png?raw=true"
          alt=""
        />
        {user ? (<Button className="app__button" onClick={()=> auth.signOut()}>Logout</Button>)
            : (
              <div className="app__loginContainer">
                <Button className="app__button" onClick={()=> setOpenSignIn(true)}>Login</Button>
                <Button className="app__button" onClick={()=> setOpen(true)}>Sign Up</Button>
              </div>
            )
        }
      </div>

      <div className="app__posts">
        <div className="app_postleft">
          {
            posts.map(({id, post}) => (
              <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
            ))
          }
        </div>

        <div className="app__postright">
        <iframe 
        src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FEmirates%2F&tabs=timeline&width=340&height=1500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId" 
        width="340" 
        height="100%" 
        style={{border:"none", overflow:"hidden"}} 
        scrolling="no" 
        frameborder="0" 
        allowfullscreen="true" 
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share">

        </iframe>
        </div>
      </div>
      <div className="app__needlogin">
          { user?.displayName ? (
            <ImageUpload username={user.displayName}/>
          ) : (
            <h3>You need to login to upload!!</h3>
          )}
      </div>
    </div>
  );
}

export default App;
