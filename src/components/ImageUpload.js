// src/components/ImageUpload.js
import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '../firebase';  // Ensure the correct path to your firebase.js file

const ImageUpload = () => {
    const [image, setImage] = useState(null);
    const [url, setUrl] = useState("");

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (image) {
            const storageRef = ref(storage, `images/${image.name}`);
            uploadBytes(storageRef, image).then((snapshot) => {
                getDownloadURL(snapshot.ref).then((url) => {
                    setUrl(url);
                    console.log("Uploaded a file and got back a download url:", url);
                });
            });
        }
    };

    return (
        <div>
            <input type="file" onChange={handleImageChange} />
            <button onClick={handleUpload}>Upload</button>
            <br />
            {url && <img src={url} alt="Uploaded" />}
        </div>
    );
};

export default ImageUpload;
