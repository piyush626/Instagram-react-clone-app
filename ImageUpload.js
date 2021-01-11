import { Button } from '@material-ui/core'
import React, { useState } from 'react'
import { storage, db } from "./firebase"
import firebase from 'firebase'
import "./ImageUpload.css"


function ImageUpload({username}) {

    const [caption, setCaption] = useState('');
    const [progress, setProgress] = useState(0);
    const [image, setImage] = useState(null);

    const handleChange = (e) => {
        if(e.target.files[0]){
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = (e) => {

        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress=Math.round((snapshot.bytesTransferred/snapshot.totalBytes)*100);
                setProgress(progress);
            },
            (error) => {
                console.log(error);
                alert(error.message);
            },
            () => {
                storage
                .ref("images")
                .child(image.name)
                .getDownloadURL()
                .then(url => {
                    db.collection("posts").add({
                        timestamp:firebase.firestore.FieldValue.serverTimestamp(),
                        caption:caption,
                        imageUrl:url,
                        username:username 
                    });
                    setProgress(0);
                    setCaption("");
                    setImage(null);
                })
            }
        )

    }

    return (
        <div className="imageupload">
            <progress className="imageupload__progress" value={progress} max="100"/>
            <input className="imageupload__inputone" type="text" placeholder="Enter a caption..." onChange={ 
                event => setCaption(event.target.value)
            }  value={caption}/>
            <input className="imageupload__inputtwo" type="file" onChange={handleChange}/>
            <Button className="imageUpload__button" onClick={handleUpload}>
                Upload
            </Button>
        </div>
    )
}

export default ImageUpload
