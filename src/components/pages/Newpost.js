import { useState, useRef, useEffect, useContext} from "react";
import {Link} from 'react-router-dom';
import {FaCross} from 'react-icons/fa';
import {BiDownload} from 'react-icons/bi';
import {AiOutlineDelete} from 'react-icons/ai';
import {ImEmbed} from 'react-icons/im';
import { ImgurContext } from '../Context/ImgurContext';
import { useNavigate } from 'react-router-dom';

import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
   

function Newpost() {
  const navigate = useNavigate();
  const [options, setOptions] =useState();
  const [values, setValues] =useState([]);
  const [err, setErr] = useState(false);
  const [title, setTitle] =useState("");
  const [tag, setTag] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const {userID,setUserID, isLoggedIn, setIsLoggedIn} = useContext(ImgurContext)

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
    const rawData = localStorage.getItem('Imgur_USER');

    if (rawData) {
      const localData = JSON.parse(rawData);
      localStorage.removeItem('Imgur_USER');
    }

    setIsLoggedIn(false);
  } catch (error) {
    console.error('Error while handling logout:', error);
  }
};

const check =async() => {

  if (!isLoggedIn) {
    alert("You need to sign in to create a post.");
    toast.success("You need to sign in to create a post.");
    return;
  }
  // e.preventdefault();
  console.log('Request Started');
  let formdata = new FormData()
  formdata.append('title', title);
  formdata.append('tag', tag);
  formdata.append('description', description);
  formdata.append('image', image);
  formdata.append('user', userID.data.id);
  console.log("form data",formdata.get('image'));

   console.log("form data", formdata.get('user'));
//  return false;
  let response = await fetch("http://localhost:3007/post",{
  method:"Post",
  body:formdata,
});


if(response.status === 200){
toast.success("Post created");
navigate("/");
}
console.log('response',response.data);
}

useEffect(() => {
  if(localStorage){
    let rawData = localStorage.getItem("Imgur_USER")
    let localData = JSON.parse(rawData)
    setUserID(localData)
  }
  console.log('I restarted');
  fetch("http://localhost:3007/tag",)
  .then((data) => data.json())
  .then((val) => {
    setValues(val);
  });

},[]);
// console.log(values, "values")

// console.log(userID.data.id);
  
    return (
      <section className="container">
         
        <div className='navBar'>
          <div className='flex'>
            <div className="logo"><Link to="/" className='td'>imgur</Link></div>
          </div>

          <div className='flex'>
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
                <h2 className='navBar-signin'  onClick={handleLogin}><Link to="/signin" className='newpost'>Sign In</Link></h2>
                <div><button><Link to="/signup" className='newpost'>Sign Up</Link></button></div>
              </div>
              )
          }
         
          </div>

        </div>

        <div className='hamb-flex'>
                    <div class="hamburger_container mg">
                        <label for="menu_check">&#9776;</label> 
                        <input type="checkbox" id="menu_check" />
                        <div class="hide_nav_container"><br/>
                            <nav>
                            {isLoggedIn ? (
          <div className=''>
            <div className='welcome-note'><p className='newpost'>Welcome,</p>
            {` ${JSON.parse(localStorage.getItem('Imgur_USER')).data.username}!. `}
           
            <p className='newpost'>You are logged in.</p> </div>
            <ul>
                                    
                                    <div><button onClick={handleNewPostClick}><li><Link to="/newpost" className='newpost'>New post</Link></li></button></div>
                                    <li><Link to="/">Home</Link></li>
                                    <button onClick={handleLogout}>Logout</button>
 
                                 </ul>
          </div>
        ) : (
          <div className=''>
         
     
                                <ul>
                                    
                                   <div><button onClick={handleNewPostClick}><li><Link to="/newpost" className='newpost'>New post</Link></li></button></div>
                                   <li><Link to="/signup" className='hamburger-link'>Sign Up</Link></li>
                                   <li><Link to="/signin" className='hamburger-link' onClick={handleLogin}>Sign In</Link></li>
                                   <li><Link to="/">Home</Link></li>
                                   {/* <button onClick={handleLogout}>Logout</button> */}

                                </ul>
                                </div>
                        )}

                            </nav>   
                
                        </div>  
                   
                    </div>
                    <div><input type='text' placeholder="Images, #tags, @users oh my!" /></div>
      </div>

        <form className="grid-2" onSubmit={(e)=>{e.preventDefault();}} >
            <div className="container1" value={userID}>

              <div className="input-title"> <input type="text"  placeholder="Give your post a unique title..." onChange={(e)=>setTitle(e.target.value)} /></div>

              <input type="file" id="image" name="image" onChange={(e)=>setImage(e.target.files[0])} />

              <div className="input-title2"> <input type="text"  placeholder="Add a description" onChange={(e)=>setDescription(e.target.value)} /></div>
        
            </div>

            <div className="container2">
              <div className="poost"><p>Post</p></div>
              <div className="postOptions">
                <div className="flex">
                <button className="Button Button-community" onClick={check}>To Community</button>
                <button className="Button Button-grabLink">Grab Link</button>
                </div>
                <p className="postStatus"> Your post is currently Hidden</p>

                <div className="checkbox-tag flex">
                  <label><input className="checkbox" type="checkbox"/></label>
                  <label className="mature">Mature (?)</label>
                </div>

                <div className="add-tags">Tags</div>
                  <select name="tag" onChange={(e)=>setTag(e.target.value)}>
                 {
                   values.map((opts,i) => <option key={i} value={opts._id}>{opts.title}</option>)
                 }
                  </select>
                </div>

              <div className="add-tags">IMG TOOLS</div>
                
               
                <div className='span-tag'>
                  <span><FaCross/></span>
                  <p>Add more images</p>
                </div>
                <div className='span-tag'><span><ImEmbed/> </span>Embed post</div>
                <div className='span-tag'><span><BiDownload/> </span>Down post</div>
                <div className='span-tags'><span><AiOutlineDelete/> </span>Delete post</div>
                
                    
            </div>
        </form>
        <ToastContainer />
      </section>
    );
  }
  

 
  export default Newpost;