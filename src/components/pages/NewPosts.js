// import React, { useState, useContext, useEffect } from 'react';
// import { ImgurContext } from '../Context/ImgurContext';
// import { BsArrowLeftShort } from 'react-icons/bs';
// import { Link } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { ToastContainer } from 'react-toastify';

// function NewPosts() {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [selectedTag, setSelectedTag] = useState('');
//   const [newTag, setNewTag] = useState('');
//   const [tags, setTags] = useState([]);
//   const [imageFile, setImageFile] = useState(null);
//   const [imagePreview, setImagePreview] = useState('');
//   const { userID } = useContext(ImgurContext);


//   useEffect(() => {
//     fetch('https://imgurif-api.onrender.com/api/tag')
//       .then(response => response.json())
//       .then(fetchedTags => setTags(fetchedTags))
//       .catch(error => console.error('Error fetching tags:', error));
//   }, []);

//   const handleInputChange = (event) => {
//     const { name, value } = event.target;
//     switch (name) {
//       case 'title':
//         setTitle(value);
//         break;
//       case 'description':
//         setDescription(value);
//         break;
//       case 'selectedTag':
//         setSelectedTag(value);
//         setNewTag('');
//         break;
//       case 'newTag':
//         setNewTag(value);
//         break;
//       case 'image':
//         setImageFile(event.target.files[0]);
//         setImagePreview(URL.createObjectURL(event.target.files[0]));
//         break;
//       default:
//         break;
//     }
//   };

//   const validateImage = (file) => {
//     const supportedTypes = ['image/jpeg', 'image/png'];
//     return supportedTypes.includes(file.type);
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (!imageFile) {
//       console.error('Please select an image file');
//       return;
//     }

//     if (!validateImage(imageFile)) {
//       console.error('Invalid image format. Only JPEG and PNG allowed');
//       toast.error('Invalid image format. Only JPEG and PNG allowed');
//       return;
//     }

//     try {
//       let tagData;

//       if (selectedTag === 'new') {
//         const response = await fetch('https://imgurif-api.onrender.com/api/tag', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({ name: newTag })
//         });
//         const newTagData = await response.json();
//         tagData = { _id: newTagData._id, name: newTag };
//       } else {
//         const selectedTagData = JSON.parse(selectedTag);
//         tagData = { _id: selectedTagData._id, name: selectedTagData.name }; // Include both ID and name
//       }

//       const formData = new FormData();
//       formData.append('title', title);
//       formData.append('description', description);
//       formData.append('tag', JSON.stringify(tagData)); // Send both ID and name
//       formData.append('image', imageFile);
//       formData.append('user', userID);

//       const response = await fetch('https://imgurif-api.onrender.com/api/post', {
//         method: 'POST',
//         body: formData
//       });
//       const data = await response.json();
//       console.log('Post created successfully:', data);
//       toast.success('Post created successfully');

//       setTitle('');
//       setDescription('');
//       setSelectedTag('');
//       setNewTag('');
//       setImageFile(null);
//       setImagePreview('');

//     } catch (error) {
//       console.error('Error creating post:', error);
//       if (error.response && error.response.data && error.response.data.msg) {
//         // If the error response contains a custom message from the server, display it
//         toast.error(error.response.data.msg);
//       } else {
//         // If no custom message is available, display a generic error message
//         toast.error('An error occurred during post creation');
//       }
//     }
//   }

//   return (
//     <div className='post-bk'>
//       <div className='back pt-3 pb-3'><Link to="/" className='td'><BsArrowLeftShort /> back to Imgur</Link></div>
//       <div className="container pt-5 pb-5">
//         <div className="row">
//           <div className="">
//             <div className="new-post card">
//               <div className="card-header ">
//                 <h2 className="text-center text-dark">Create New Post</h2>
//               </div>
//               <div className="card-body text-dark">
//                 <form onSubmit={handleSubmit} className='create-post-form'>
//                   <div className='row'>
//                     <div className='col-lg-6'>
//                       <div className="form-group">
//                         {/* <label htmlFor="title ">Title</label> */}
//                         <input type="text" className="form-control title" id="title" name="title" placeholder='Give your post a unique title...' value={title} onChange={handleInputChange} required />
//                       </div>
//                       <div className="form-group mt-3">
//                         <label htmlFor="image">Image</label>
//                         <input
//                           type="file"
//                           className="form-control-file"
//                           id="image"
//                           name="image"
//                           onChange={handleInputChange}
//                           required
//                         />
//                         {/* Display image preview */}
//                         {imagePreview && (
//                           <img src={imagePreview} alt="Selected" style={{ marginTop: '10px', maxWidth: '100%' }} />
//                         )}
//                       </div>
//                       <div className="form-group mt-2">
//                         {/* <label htmlFor="description">Post Content</label> */}
//                         <textarea
//                           className="form-control description"
//                           id="description"
//                           name="description" placeholder='Add a description'
//                           rows="6"
//                           value={description}
//                           onChange={handleInputChange}
//                           required
//                         />
//                       </div>
//                     </div>
//                     <div className='col-lg-6'>

//                       <div className="d-flex post-buttons container">
//                         <button type="submit" className="btn btn-primary mt-3">To Community</button>
//                         <button className="btn btn-success mt-3">Grab Link</button>
//                       </div>

//                       <p className='pt-3'>Your post is currently <span className='text-info'>Hidden</span></p>
//                       <div className="form-group">
//                         <label htmlFor="selectedTag">Tags</label>
//                         <select
//                           className="form-control tags"
//                           id="selectedTag"
//                           name="selectedTag"
//                           value={selectedTag}
//                           onChange={handleInputChange}
//                         >
//                           <option value="" disabled>Select or Create Tag</option>
//                           {tags.map((tag) => (
//                             <option key={tag._id} value={JSON.stringify(tag)}>
//                               {tag.name}
//                             </option>
//                           ))}
//                           <option value="new">Create New Tag</option>
//                         </select>
//                         {selectedTag === 'new' && (
//                           <div className="mt-2">
//                             <input type="text" className="form-control tags" id="newTag" name="newTag" value={newTag} onChange={handleInputChange} placeholder="Enter New Tag Name" required />
//                           </div>
//                         )}
//                       </div>


//                     </div>



//                   </div>
//                   <ToastContainer />
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default NewPosts;


// NewPosts.js
import React, { useState, useContext, useEffect } from 'react';
import { ImgurContext } from '../Context/ImgurContext';
import { BsArrowLeftShort } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { storage } from '../../firebase'; // Import Firebase storage

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

        // Upload image file to Firebase Storage
        const storageRef = storage.ref();
        const imageRef = storageRef.child(`images/${file.name}`);
        const uploadTask = imageRef.put(file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Track upload progress here if needed
          // const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          // Handle unsuccessful uploads
          console.error('Error uploading file:', error);
          // Optionally, you can show an error message to the user
          toast.error('Error uploading image');
        },
        () => {
          // Handle successful uploads
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            console.log('File available at', downloadURL);
            setImageURL(downloadURL); // Set image URL in state or use it as needed
          });
        }
      );

      break;
    default:
      break;
  }
}

  const validateImage = (file) => {
    const supportedTypes = ['image/jpeg', 'image/png'];
    return supportedTypes.includes(file.type);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!imageFile) {
      console.error('Please select an image file');
      return;
    }

    if (!validateImage(imageFile)) {
      console.error('Invalid image format. Only JPEG and PNG allowed');
      toast.error('Invalid image format. Only JPEG and PNG allowed');
      return;
    }

    try {
      let tagData;

      if (selectedTag === 'new') {
        const response = await fetch('https://imgurif-api.onrender.com/api/tag', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name: newTag })
        });
        const newTagData = await response.json();
        tagData = { _id: newTagData._id, name: newTag };
      } else {
        const selectedTagData = JSON.parse(selectedTag); // Parse selectedTag string to object
        tagData = { _id: selectedTagData._id, name: selectedTagData.name };
      }

      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('tag', tagData.name);  // Send both ID and name
      formData.append('image', imageFile);
      formData.append('user', userID);

      const response = await fetch('https://imgurif-api.onrender.com/api/post', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      console.log('Post created successfully:', data);
      toast.success('Post created successfully');

      setTitle('');
      setDescription('');
      setSelectedTag('');
      setNewTag('');
      setImageFile(null);
      setImagePreview('');

    } catch (error) {
      console.error('Error creating post:', error);
      if (error.response && error.response.data && error.response.data.msg) {
        // If the error response contains a custom message from the server, display it
        toast.error(error.response.data.msg);
      } else {
        // If no custom message is available, display a generic error message
        toast.error('An error occurred during post creation');
      }
    }
  };

  return (
    <div className='post-bk'>
      <div className='back pt-3 pb-3'><Link to="/" className='td'><BsArrowLeftShort /> back to Imgur</Link></div>
      <div className="container pt-5 pb-5">
        <div className="row">
          <div className="">
            <div className="new-post card">
              <div className="card-header ">
                <h2 className="text-center text-dark">Create New Post</h2>
              </div>
              <div className="card-body text-dark">
                <form onSubmit={handleSubmit} className='create-post-form'>
                  <div className='row'>
                    <div className='col-lg-6'>
                      <div className="form-group">
                        <input type="text" className="form-control title" id="title" name="title" placeholder='Give your post a unique title...' value={title} onChange={handleInputChange} required />
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
                        {/* Display image preview */}
                        {imagePreview && (
                          <img src={imagePreview} alt="Selected" style={{ marginTop: '10px', maxWidth: '100%' }} />
                        )}
                      </div>
                      <div className="form-group mt-2">
                        <textarea
                          className="form-control description"
                          id="description"
                          name="description" placeholder='Add a description'
                          rows="6"
                          value={description}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className='col-lg-6'>
                      <div className="d-flex post-buttons container">
                        <button type="submit" className="btn btn-primary mt-3">To Community</button>
                        <button className="btn btn-success mt-3">Grab Link</button>
                      </div>
                      <p className='pt-3'>Your post is currently <span className='text-info'>Hidden</span></p>
                      <div className="form-group">
                        <label htmlFor="selectedTag">Tags</label>
                        <select
                          className="form-control tags"
                          id="selectedTag"
                          name="selectedTag"
                          value={selectedTag}
                          onChange={handleInputChange}
                        >
                          <option value="" disabled>Select or Create Tag</option>
                          {tags.map((tag) => (
                            <option key={tag._id} value={JSON.stringify(tag)}>
                              {tag.name}
                            </option>
                          ))}
                          <option value="new">Create New Tag</option>
                        </select>
                        {selectedTag === 'new' && (
                          <div className="mt-2">
                            <input type="text" className="form-control tags" id="newTag" name="newTag" value={newTag} onChange={handleInputChange} placeholder="Enter New Tag Name" required />
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
