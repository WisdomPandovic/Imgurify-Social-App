import {Link} from 'react-router-dom';
import { useContext, useState, useEffect } from "react";
import {FaFacebook} from 'react-icons/fa';
import {FaTwitter} from 'react-icons/fa';
import {FaApple} from 'react-icons/fa';
import {FaGoogle} from 'react-icons/fa';
import {FaYahoo} from 'react-icons/fa';
import {BsArrowLeftShort} from 'react-icons/bs';
import { useLocation, useNavigate } from 'react-router-dom';
import { ImgurContext } from '../Context/ImgurContext';
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { handleErrorResponse, notifySuccess } from "../../utils/helpers";

function Signin(){

    const {setIsLoggedIn, setUserID} = useContext(ImgurContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [err, setErr] = useState(false);
    const [user, setUser] = useState({
      username: "",
      password: "",
      lastLogin: "",
    });
  
    const submitForm = (e) => {
      e.preventDefault();
      if (user.username === "" || user.password === "") {
        setErr(true);
      } else {
        setErr(false);
        axios.post("https://imgurif-api.onrender.com/api/login", user)
        // axios.post("http://localhost:3007/api/login", user)
          .then((resp) => {
            if (resp.data.msg === 'Login successful') {
              localStorage.setItem('Imgur_USER', JSON.stringify(resp.data));
              setIsLoggedIn(true);
              setUserID(resp.data.user._id); 
              const redirectTo = location.state?.from || '/';
              navigate(redirectTo);
            } else {
              console.error("invalid user please signup..");
            }
          })
          .catch((error) => {
            // console.error("Login error:", error);
            handleErrorResponse(error)
            if (error.response && error.response.status === 404 && error.response.data.msg === 'Invalid username or password') {
              toast.error("No user with the provided username. Please sign up.");
            } else {
              console.error("An unexpected error occurred during login.");
            }
          });
          
      }
    };

     return(
      <div className="reg-bk">
          <div className="back"><Link to="/" className="td"><BsArrowLeftShort/> back to Imgurify</Link></div>
      <div className="row justify-content-center text-white">
        <div className="col-md-6">
          <div className="">
          
            <div className="reg-text text-center pt-5"><h2>Imgurify</h2></div>
            <div className="form-heading text-center mt-5"><h2 className='pt-5 form-heading2'>Sign In with</h2></div>

            <div className="imgur-icons">
              <div className="grid-5 row">
                <div className="sc-bk col"><FaFacebook className="imgur-social-icons" style={{ fontSize: '20px' }}/></div>
                <div className="sc-bk col"><FaTwitter className="imgur-social-icons" style={{ fontSize: '20px' }}/></div>
                <div className="sc-bk col"><FaApple className="imgur-social-icons" style={{ fontSize: '20px' }}/></div>
                <div className="sc-bk col"><FaGoogle className="imgur-social-icons" style={{ fontSize: '20px' }}/></div>
                <div className="sc-bk col"><FaYahoo className="imgur-social-icons" style={{ fontSize: '20px' }}/></div>
              </div>
            </div>

            <div className=" text-center"><h2 className='form-heading2'>or with Imgurify</h2></div>
            
            <form className="form-content" onSubmit={submitForm}>
              <div className='form-input'>
              <div className="form-control">
                <input type="text" value={user.username} placeholder="Username" onChange={(e) => setUser({...user, username: e.target.value})}/>
                {err === true && user.username === "" ? <span>Username required</span> : null}
              </div>
              <div className="form-control mt-3">
                <input type="password" value={user.password} placeholder="Password" onChange={(e) => setUser({...user, password: e.target.value})}/>
                {err === true && user.password === "" ? <span>Password required</span> : null}
              </div>
              </div>
              <div className="form-btn2">
                <div><Link to="/signup" className="newpost"><p>need an account?</p></Link></div>
                <button className="btn btn-primary">Sign In</button>
              </div>
              <ToastContainer />
            </form>
          </div>
        </div>
      </div>
    </div>
         
     )
}
export default Signin;