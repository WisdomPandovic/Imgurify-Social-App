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
        console.log(userData)

        if ( user.username ==="" || user.email ==="" || user.password ==="" || user.phoneNumber ==="" ){
          setErr(true);
        }else {
            setErr(false);
            axios.post("http://localhost:3007/users", userData)
            .then((resp) => {
                console.log(resp.data)
                setErr(false);
                toast.success("Sign up successful.");
                navigate("/signin");
            
            })
            .catch((error) => {
                console.error(error);
                toast.error("Sign up unsuccessful. Please try again.");
            });
           
            
        }
     };
    

     return(
        <div className="reg-bk">
            <div className='back'><Link to="/" className='td'><BsArrowLeftShort/>back to Imgur</Link></div>
            <div className='reg-text'><h2>imgur</h2></div>
           
            <div className="form-heading">
                <h2>Registration with</h2>
            </div>

            <div className='imgur-icons'>
                <div className='grid-5'>
                    <div className='sc-bk'><FaFacebook className='imgur-social-icons'/></div>
                    <div className='sc-bk'><FaTwitter className='imgur-social-icons'/></div>
                    <div className='sc-bk'><FaApple className='imgur-social-icons'/></div>
                    <div className='sc-bk'><FaGoogle className='imgur-social-icons'/></div>
                    <div className='sc-bk'><FaYahoo className='imgur-social-icons'/></div>
                </div>
            </div>

            <div className="form-heading2">
                <h2>or with Imgur</h2>
            </div>

            <form className="form-content" onSubmit={submitForm}>
                <div className="form-control">
                    
                    <input type="text" value={user.username} placeholder='Username' onChange={(e) => setUser({...user, username: e.target.value})}/>
                    {err === true && user.username === "" ? <span>Username required</span> : null}
                </div>
               
                <div className="form-control">
                    
                    <input type="text" value={user.email} placeholder='Email' onChange={(e) => setUser({...user, email: e.target.value})}/>
                    {err === true && user.email === "" ? <span>Email required</span> : null}
                </div>
                <div className="form-control">
                   
                    <input type="text" value={user.password} placeholder='Password' onChange={(e) => setUser({...user, password: e.target.value})}/>
                    {err === true && user.password === "" ? <span>Password required</span> : null}
                </div>

                 <div className="form-control">
                    
                    <input type="text" value={user.phoneNumber} placeholder='Phone Number' onChange={(e) => setUser({...user, phoneNumber: e.target.value})}/>
                    {err === true && user.phoneNumber === "" ? <span>Phone number required</span> : null}
                </div>

                <div className='form-text'>
                    <div><p>Standard message and data rates may apply.</p></div>
                    <div><h2>Why do I have to verify my phone?</h2></div>
                </div>

                <div className="form-btn flex">
                    <button >Submit</button>
                    <p>sign in</p>
                </div>
            </form>
            <ToastContainer />
        </div>
         
     )
}
export default SignUp;