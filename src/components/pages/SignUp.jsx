 import {Link} from 'react-router-dom';
import { useState } from "react";
import {FaFacebook} from 'react-icons/fa';
import {FaTwitter} from 'react-icons/fa';
import {FaApple} from 'react-icons/fa';
import {FaGoogle} from 'react-icons/fa';
import {FaYahoo} from 'react-icons/fa';
import {BsArrowLeftShort} from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { handleErrorResponse, notifySuccess } from "../../utils/helpers";

function SignUp(){
    const navigate = useNavigate();
    const [err, setErr] = useState(false);
     const [user, setUser] = useState({
        username: "",
        email: "",
        password: "",
        phoneNumber: "",
     });

     const submitForm = (e) => {
        e.preventDefault();
        const userData = {
            username: user.username,
            phoneNumber: user.phoneNumber,
            email: user.email,
            password: user.password,
        };
        // console.log(userData)

        if ( user.username ==="" || user.email ==="" || user.password ==="" || user.phoneNumber ==="" ){
          setErr(true);
        }else {
            setErr(false);
            axios.post("https://imgurif-api.onrender.com/api/users", userData)
            // axios.post("http://localhost:3007/api/users", userData)
            .then((resp) => {
                // console.log(resp.data)
                setErr(false);
                toast.success("Sign up successful.");
                navigate("/signin");
                toast.success("Sign up successful.");
            })
            .catch((error) => {
                console.error(error);
                handleErrorResponse(error)
                toast.error("Sign up unsuccessful. Please try again.");
            });   
        }
     };    

     return(
        <div className="reg-bk">
            <div className='back'><Link to="/" className='td'><BsArrowLeftShort/>back to Imgur</Link></div>

            <div className="row justify-content-center text-white">
        <div className="col-md-6">
          <div className="">
            <div className='reg-text text-center pt-5'><h2>Imgurify</h2></div>
           
            <div className="form-heading text-center mt-5">
                <h2 className='pt-5 form-heading2'>Registration with</h2>
            </div>

            <div className="imgur-icons">
              <div className="grid-5 row">
                <div className="sc-bk col"><FaFacebook className="imgur-social-icons" style={{ fontSize: '20px' }}/></div>
                <div className="sc-bk col"><FaTwitter className="imgur-social-icons" style={{ fontSize: '20px' }}/></div>
                <div className="sc-bk col"><FaApple className="imgur-social-icons" style={{ fontSize: '20px' }}/></div>
                <div className="sc-bk col"><FaGoogle className="imgur-social-icons" style={{ fontSize: '20px' }}/></div>
                <div className="sc-bk col"><FaYahoo className="imgur-social-icons" style={{ fontSize: '20px' }}/></div>
              </div>
            </div>

            <div className="text-center">
                <h2 className='form-heading2'>or with Imgurify</h2>
            </div>

            <form className="form-content" onSubmit={submitForm}>
                <div className='form-input'>
                <div className="form-control">
                    
                    <input type="text" value={user.username} placeholder='Username' onChange={(e) => setUser({...user, username: e.target.value})}/>
                    {err === true && user.username === "" ? <span>Username required</span> : null}
                </div>
               
                <div className="form-control mt-3">
                    
                    <input type="text" value={user.email} placeholder='Email' onChange={(e) => setUser({...user, email: e.target.value})}/>
                    {err === true && user.email === "" ? <span>Email required</span> : null}
                </div>
                <div className="form-control mt-3">
                   
                    <input type="password" value={user.password} placeholder='Password' onChange={(e) => setUser({...user, password: e.target.value})}/>
                    {err === true && user.password === "" ? <span>Password required</span> : null}
                </div>

                 <div className="form-control mt-3">
                    
                    <input type="text" value={user.phoneNumber} placeholder='Phone Number' onChange={(e) => setUser({...user, phoneNumber: e.target.value})}/>
                    {err === true && user.phoneNumber === "" ? <span>Phone number required</span> : null}
                </div>
                </div>

                <div className='form-text'>
                    <div><p className='text-white text-center'>Standard message and data rates may apply.</p></div>
                    <div><h2 className='text-white'>Why do I have to verify my phone?</h2></div>
                </div>

                <div className="form-btn2 ">
                <div><Link to="/signin" className="newpost"><p>sign in</p></Link></div>
                <button className="btn btn-primary">Sign Up</button>
                </div>
            </form>
            </div>
            </div>
            </div>
            <ToastContainer />
        </div>   
     )
}
export default SignUp;