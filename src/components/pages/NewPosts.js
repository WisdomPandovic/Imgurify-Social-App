import React, { useState, useContext, useEffect } from 'react';
import { ImgurContext } from '../Context/ImgurContext';
import { BsArrowLeftShort } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { storage } from '../../firebase'; // Import Firebase storage
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

function NewPosts() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [newTag, setNewTag] = useState('');
  const [tags, setTags] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageURL, setImageURL] = useState('');
  const { userID } = useContext(ImgurContext);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await fetch('https://imgurif-api.onrender.com/api/tag');
      const fetchedTags = await response.json();
      setTags(fetchedTags);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case 'title':
        setTitle(value);
        break;
      case 'description':
        setDescription(value);
        break;
      case 'selectedTag':
        setSelectedTag(value);
        setNewTag('');
        break;
      case 'newTag':
        setNewTag(value);
        break;
      case 'image':
        const file = event.target.files[0];
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        break;
      default:
        break;
    }
  };

  const validateImage = (file) => {
    const supportedTypes = ['image/jpeg', 'image/png'];
    return supportedTypes.includes(file.type);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!imageFile) {
      toast.error('Please select an image file');
      return;
    }
  
    if (!validateImage(imageFile)) {
      toast.error('Invalid image format. Only JPEG and PNG allowed');
      return;
    }
  
    try {
      // Upload image to Firebase Storage
      const storageRef = ref(storage, `images/${imageFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);
  
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
          toast.info(`Uploading image: ${Math.round(progress)}%`);
        },
        (error) => {
          console.error('Error uploading file:', error);
          toast.error('Error uploading image');
        },
        async () => {
          // Get download URL after successful upload
          const downloadURL = await getDownloadURL(storageRef);
          setImageURL(downloadURL); // Set image URL
  
          let tagData;
          if (selectedTag === 'new') {
            const response = await fetch('https://imgurif-api.onrender.com/api/tag', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ name: newTag }),
            });
            const newTagData = await response.json();
            tagData = { _id: newTagData._id, name: newTag };
          } else {
            const selectedTagData = JSON.parse(selectedTag);
            tagData = { _id: selectedTagData._id, name: selectedTagData.name };
          }
  
          // Create post
          const formData = new FormData();
          formData.append('title', title);
          formData.append('description', description);
          formData.append('tag', tagData.name);
          formData.append('imagepath', downloadURL);
          formData.append('user', userID);
  
          const response = await fetch('https://imgurif-api.onrender.com/api/post', {
            method: 'POST',
            body: formData,
          });
  
          if (response.ok) {
            toast.success('Post created successfully');
            setTitle('');
            setDescription('');
            setSelectedTag('');
            setNewTag('');
            setImageFile(null);
            setImagePreview('');
          } else {
            toast.error('Failed to create post');
          }
        }
      );
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('An error occurred during post creation');
    }
  };
  

  return (
    <div className="post-bk">
      <div className="back pt-3 pb-3">
        <Link to="/" className="td">
          <BsArrowLeftShort /> back to Imgur
        </Link>
      </div>
      <div className="container pt-5 pb-5">
        <div className="row">
          <div className="">
            <div className="new-post card">
              <div className="card-header">
                <h2 className="text-center text-dark">Create New Post</h2>
              </div>
              <div className="card-body text-dark">
                <form onSubmit={handleSubmit} className="create-post-form">
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control title"
                          id="title"
                          name="title"
                          placeholder="Give your post a unique title..."
                          value={title}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="form-group mt-3">
                        <label htmlFor="image">Image</label>
                        <input
                          type="file"
                          className="form-control-file"
                          id="image"
                          name="image"
                          onChange={handleInputChange}
                          required
                        />
                        {imagePreview && (
                          <img
                            src={imagePreview}
                            alt="Selected"
                            style={{ marginTop: '10px', maxWidth: '100%' }}
                          />
                        )}
                      </div>
                      <div className="form-group mt-2">
                        <textarea
                          className="form-control description"
                          id="description"
                          name="description"
                          placeholder="Add a description"
                          rows="6"
                          value={description}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="d-flex post-buttons container">
                        <button type="submit" className="btn btn-primary mt-3">
                          To Community
                        </button>
                        <button className="btn btn-success mt-3">Grab Link</button>
                      </div>
                      <p className="pt-3">
                        Your post is currently <span className="text-info">Hidden</span>
                      </p>
                      <div className="form-group">
                        <label htmlFor="selectedTag">Tags</label>
                        <select
                          className="form-control tags"
                          id="selectedTag"
                          name="selectedTag"
                          value={selectedTag}
                          onChange={handleInputChange}
                        >
                          <option value="" disabled>
                            Select or Create Tag
                          </option>
                          {tags.map((tag) => (
                            <option key={tag._id} value={JSON.stringify(tag)}>
                              {tag.name}
                            </option>
                          ))}
                          <option value="new">Create New Tag</option>
                        </select>
                        {selectedTag === 'new' && (
                          <div className="mt-2">
                            <input
                              type="text"
                              className="form-control tags"
                              id="newTag"
                              name="newTag"
                              value={newTag}
                              onChange={handleInputChange}
                              placeholder="Enter New Tag Name"
                              required
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <ToastContainer />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewPosts;