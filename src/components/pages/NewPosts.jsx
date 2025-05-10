import React, { useState, useContext, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { ImgurContext } from '../Context/ImgurContext';
import { BsArrowLeftShort } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { storage } from '../../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { FaFacebookF, FaTwitter, FaWhatsapp, FaLinkedinIn } from 'react-icons/fa';

function NewPosts() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [newTag, setNewTag] = useState('');
  const [tags, setTags] = useState([]);
  const [isMature, setIsMature] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageURL, setImageURL] = useState('');
  const { userID } = useContext(ImgurContext);

  const isMobile = window.innerWidth <= 989;

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

  const handleDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    multiple: false,
  });

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
      default:
        break;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!imageFile) {
      toast.error('Please select an image file');
      return;
    }

    try {
      const storageRef = ref(storage, `images/${imageFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // console.log(`Upload is ${progress}% done`);
          // toast.info(`Uploading image: ${Math.round(progress)}%`);
        },
        (error) => {
          console.error('Error uploading file:', error);
          toast.error('Error uploading image');
        },
        async () => {
          const downloadURL = await getDownloadURL(storageRef);
          setImageURL(downloadURL);

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

          const formData = new FormData();
          formData.append('title', title);
          formData.append('description', description);
          formData.append('tag', tagData.name);
          formData.append('imagepath', downloadURL);
          formData.append('user', userID);
          formData.append('isMature', isMature);

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
            setIsMature(false);
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
      <div className=" p-3">
        <Link to="/" className=" p-3">
          <BsArrowLeftShort /> back to Imgur
        </Link>
      </div>
      <div className="container pt-5 pb-5">
        <div className="row">
          <div className="">
            <div className="card-body text-dark">
              <form className="create-post-form" onSubmit={handleSubmit}>
                <div className="row">
                  {/* Left Column: Form Fields */}
                  <div className="col-12 col-lg-7">
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
                        style={{ fontSize: '28px', color: "white" }}
                      />
                    </div>
                    <div
                      {...getRootProps()}
                      className={`form-group mt-3 dropzone ${isDragActive ? 'active-dropzone' : ''}`}
                      style={{
                        border: '2px dashed #ccc',
                        padding: '20px',
                        textAlign: 'center',
                        color: "white"
                      }}
                    >
                      <input {...getInputProps()} />
                      {isDragActive ? (
                        <p>Drop the image here...</p>
                      ) : (
                        <p>Drag & drop an image here, or click to select a file</p>
                      )}
                    </div>
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Selected"
                        style={{ marginTop: '10px', maxWidth: '100%' }}
                      />
                    )}
                    <div className="form-group mt-2">
                      <textarea
                        className="form-control description"
                        id="description"
                        name="description"
                        placeholder="Add a description"
                        rows="3"
                        value={description}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Right Column: Post Buttons and Tags */}
                  <div className="col-12 col-lg-5 post-container" style={{
                    position: isMobile ? 'static' : 'fixed',
                    top: isMobile ? 'auto' : '100px',
                    right: isMobile ? 'auto' : '10px',
                    zIndex: isMobile ? 'auto' : '999',
                  }}>
                    <p className="mt-3 text-white">Share With Community</p>
                    <div className="d-flex flex-column post-buttons">
                      <button
                        type="submit"
                        className="btn btn-success"
                        style={{ fontSize: '12px' }}
                      >
                        To Community
                      </button>
                      <button
                        className="btn"
                        style={{ backgroundColor: '#585d6a', color: '#fff', fontSize: '12px' }}
                      >
                        Grab Link
                      </button>
                    </div>

                    <div className="mt-5">
                      <h2 className="text-white fs-5">Quick share</h2>
                      <div className="d-flex align-items-center justify-content-center gap-3 mt-3">
                        <a
                          href="https://www.facebook.com/sharer/sharer.php?u=YOUR_URL"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="d-flex align-items-center justify-content-center rounded-circle text-white"
                          style={{ backgroundColor: '#3b5998', width: 50, height: 50 }}
                        >
                          <FaFacebookF />
                        </a>

                        <a
                          href="https://twitter.com/intent/tweet?url=YOUR_URL"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="d-flex align-items-center justify-content-center rounded-circle text-white"
                          style={{ backgroundColor: '#1DA1F2', width: 50, height: 50 }}
                        >
                          <FaTwitter />
                        </a>

                        <a
                          href="https://api.whatsapp.com/send?text=YOUR_URL"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="d-flex align-items-center justify-content-center rounded-circle text-white"
                          style={{ backgroundColor: '#25D366', width: 50, height: 50 }}
                        >
                          <FaWhatsapp />
                        </a>

                        <a
                          href="https://www.linkedin.com/shareArticle?url=YOUR_URL"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="d-flex align-items-center justify-content-center rounded-circle text-white"
                          style={{ backgroundColor: '#0077B5', width: 50, height: 50 }}
                        >
                          <FaLinkedinIn />
                        </a>
                      </div>
                    </div>
                    {/* <p className="pt-3" style={{ color: '#b4b9c2', fontSize: "13px" }}>
                      Your post is currently <span className="text-success">Hidden</span>
                    </p> */}

                    {/* <div className="form-group text-white">
                      <label htmlFor="selectedTag" className="mb-1">Tags</label>
                      <select
                        className="form-control tags"
                        id="selectedTag"
                        name="selectedTag"
                        value={selectedTag}
                        onChange={handleInputChange}
                        style={{ fontSize: '12px' }}
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
                        <div className="mt-2 mb-5">
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
                    </div> */}

                    <div className="form-group tag-input text-white mb-4 mt-5">
                      <label htmlFor="selectedTag" className="form-label text-sm text-gray-700 mb-1">
                        Tags
                      </label>
                      <div className="d-flex gap-3">
                        <select
                          id="selectedTag"
                          name="selectedTag"
                          value={selectedTag}
                          onChange={handleInputChange}
                          className="form-control bg-secondary text-white shadow-sm"
                          style={{ fontSize: '14px', height: '38px' }} // standard Bootstrap height
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
                          <input
                            type="text"
                            id="newTag"
                            name="newTag"
                            value={newTag}
                            onChange={handleInputChange}
                            placeholder="Enter New Tag Name"
                            required
                            className="form-control create-new-tag bg-success text-white  shadow-sm"
                            style={{ fontSize: '14px', height: '38px', color: 'white' }} // match the select height
                          />
                        )}
                      </div>
                    </div>

                    <div className='pb-1' style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '5px' }}>
                      <input type="checkbox" id="mature" name="mature" checked={isMature} onChange={() => setIsMature(!isMature)} />
                      <label htmlFor="mature" style={{ color: '#b4b9c2', fontSize: '13px', margin: 0 }}>
                        Mature (?)
                      </label>
                    </div>
                  </div>
                </div>
                <ToastContainer />
              </form>
            </div>
          </div>
        </div>
        {/* <div className="container d-flex justify-content-center flex-column card-footer text-center bg-light mt-5" style={{ position: 'absolute', bottom: 0, width: '100%' }}>
          <small className="text-muted">Make sure to review your post before submitting.</small>
        </div> */}
      </div>

    </div>
  );
}

export default NewPosts;
