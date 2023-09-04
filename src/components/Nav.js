import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { ImgurContext } from './Context/ImgurContext';
import img from '../images/bk-img-1.jpg';
import img1 from '../images/bk-img-1.jpg';
import img2 from '../images/bk-img-2.jpg';
import img3 from '../images/bk-img-3.jpg';
import img4 from '../images/bk-img-4.jpg';
import img5 from '../images/bk-img-5.jpg';
import img6 from '../images/bk-img-6.jpg';
import img7 from '../images/bk-img-7.png';
import img8 from '../images/bk-img-8.jpg';
import img9 from '../images/bk-img-9.jpg';
import img10 from '../images/bk-img-10.jpg';
import img11 from '../images/bk-img-11.jpg';
import img12 from '../images/bk-img-12.jpg';
import img13 from '../images/bk-img-13.png';
import img14 from '../images/bk-img-14.jpg';
import img15 from '../images/bk-img-15.jpg';
import img16 from '../images/bk-img-16.jpg';

function Nav() {
  const [tags, setTags] = useState([]);
  const { isLoggedIn, setIsLoggedIn } = useContext(ImgurContext);
  const navigate = useNavigate();
  const [showAdditionalTags, setShowAdditionalTags] = useState(false);

  const tagImageMap = {
    '64ee4fde9a6bc22a59a6177a': img,
    '64ee511c9a6bc22a59a617b9': img1,
    '64ee519a9a6bc22a59a6187d': img2,
    '64ee51b79a6bc22a59a6189f': img3,
    '64ee51d59a6bc22a59a618c7': img4,
    '64ee51ff9a6bc22a59a618e9': img5,
    '64ee522f9a6bc22a59a6190b': img6,
    '64ee525c9a6bc22a59a6192d': img7,
    '64ee8f07662b66201124941e': img8,
    '64ee8f2b662b662011249442': img9,
    '64ee8f56662b662011249464': img10,
    '64ee8f90662b662011249488': img11,
    '64ee8fd6662b6620112494ac': img12,
    '64ee8fef662b6620112494ce': img13,
    '64ee9018662b6620112494f2': img14,
    '64ee901f662b6620112494f4': img15,
    '64ee904e662b662011249550': img16,
    '64ee9075662b662011249572': img1,
    '64ee909f662b662011249596': img2,
    '64ee90e4662b6620112495d6': img3,
    '64ee9152662b6620112495fa': img8,
    '64ee9159662b6620112495fc': img3,
    '64ee9162662b6620112495fe': img11,
    '64f10b7fa587a777229adb38': img7,
  };

  const allTagIds = Object.keys(tagImageMap);
  const initialTagIds = allTagIds.slice(0, 8);
  const additionalTagIds = allTagIds.slice(8);


  useEffect(() => {
    const rawData = localStorage.getItem("Imgur_USER");
    if (rawData) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleNewPostClick = () => {
    if (isLoggedIn) {
      navigate("/newpost");
    } else {
      alert("You need to sign in to create a post.");
      toast.success("You need to sign in to create a post.");
      navigate("/signin");
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('Imgur_USER');
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Error while handling logout:', error);
    }
  };
 
  useEffect(() => {
    const tagIds = Object.keys(tagImageMap);

    Promise.all(tagIds.map(tagId =>
      fetch(`http://localhost:3007/tag/${tagId}`)
        .then(resp => resp.json())
    ))
    .then(data => {
      // console.log('Fetched tag data:', data);
      data.forEach(tag => {
        // console.log('Tag ID:', tag._id);
      });
      setTags(data);
    })
    .catch(error => {
      console.error('Error fetching tags:', error);
    });
  }, []);

  useEffect(() => {
    fetch('http://localhost:3007/tag') 
      .then(response => response.json())
      .then(data => {
        // console.log('Fetched tags:', data);
        setTags(data);
      })
      .catch(error => {
        console.error('Error fetching tags:', error);
      });
  }, []);

  return (
    <nav>
      <div className='navBar'>
        <div className='flex'>
          <div className="logo">imgur</div>
          <div><button onClick={handleNewPostClick}><Link to="/newpost" className='newpost'>New post</Link></button></div>
        </div>

        <div><input type='text' placeholder="Images, #tags, @users oh my!" /></div>

        {isLoggedIn ? (
          <div className='flex'>
            <div className='welcome-note'><p className='newpost'>Welcome,</p>
            {` ${JSON.parse(localStorage.getItem('Imgur_USER')).data.username}!. `}
            <p className='newpost'>You are logged in.</p>
            </div>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div className='flex'>
            <div><button className='navBar-btn'>Go Ad-Free</button></div>
            <h2 className='navBar-signin' onClick={handleLogin}><Link to="/signin" className='newpost'>Sign In</Link></h2>
            <div><button><Link to="/signup" className='newpost'>Sign Up</Link></button></div>
          </div>
        )}
      </div>

      <div className='welcome-text'>Life is what happens when you're busy making memes.</div>
      <div className='tags'>
        <div className='trending-tags'>
          <div>Explore Tags</div>
          <div onClick={() => setShowAdditionalTags(!showAdditionalTags)} className='more-tags'>
            More Tags {showAdditionalTags ? '-' : '+'}
          </div>
        </div>
      </div>

      <div className='trending-container'>
          <div className='grid'>
    {(showAdditionalTags ? additionalTagIds : initialTagIds).map(tagId => (
      <div key={tagId}>
        <div>
          <img className="trending-img" src={tagImageMap[tagId]} alt="" />
        </div>
        <div className='tag-tittle'>
          {tags.map(tag => tag._id === tagId && (
            <Link to={`/postcategory/${tag._id}`} className='td' key={tag._id}>
              <div className='tag-name'>{tag.title}</div>
              <div className='tag-posts'>FEATURED + {tag?.post?.length} Posts</div>
            </Link>
          ))}
        </div>
      </div>
    ))}
  </div>
  <ToastContainer />
</div>


      
    </nav>
  );
}

export default Nav;

