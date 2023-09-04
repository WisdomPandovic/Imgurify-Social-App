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

function Signin(){

    const {userID, setUserID, setIsLoggedIn} = useContext(ImgurContext)

    const navigate = useNavigate()
    const location = useLocation();
    const [err, setErr] = useState(false);
    const [user, setUser] = useState({
       username: "",
       password: "",
       lastLogin: "", 
    });
    let login = user;

  useEffect(() => {
    const rawData = localStorage.getItem("Imgur_USER");
    if (rawData) {
        const localData = JSON.parse(rawData);
        setIsLoggedIn(true);
        setUserID(localData.data.id);
    }
}, []);
    
    const submitForm =(e) => {
        e.preventDefault();
        if ( user.username ==="" || user.password ==="" ){
          setErr(true);
        }else {
            setErr(false)
            axios.post("http://localhost:3007/login", login)
            .then((resp) => {
                if(resp.data.msg === 'Login successful'){
                    console.log(resp.data);
                localStorage.setItem('Imgur_USER', JSON.stringify(resp.data))
                setIsLoggedIn(true)
                let rawData = localStorage.getItem("Imgur_USER")
                let localData = JSON.parse(rawData)

                setUser({
                    ...user,
                    lastLogin: new Date(localData.lastLogin).toLocaleString(),
                });
                // setUserID(localData)
                setUserID(localData.data.id);
                console.log(userID);
                console.log(setUserID);
                    // alert("successfully logged in")
                    toast.success("successfully logged in");
                    // navigate("/");
                    const redirectTo = location.state?.from || '/';
                    navigate(redirectTo);
                }else{
                    // alert("invalid user please signup..")
                    toast.error("invalid user please signup..");
                    
                }
             
            })
            
        }
     };
     useEffect(() => {
        console.log("Updated userID:", userID);
      
    }, [userID]);

     console.log(userID);
     return(
        <div className="reg-bk">
            <div className='back'><Link to="/" className='td'><BsArrowLeftShort/> back to Imgur</Link></div>
            <div className='reg-text'><h2>imgur</h2></div>
           
            <div className="form-heading">
                <h2>Sign In with</h2>
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
                   
                    <input type="text" value={user.password} placeholder='Password' onChange={(e) => setUser({...user, password: e.target.value})}/>
                    {err === true && user.password === "" ? <span>Password required</span> : null}
                </div>

                <div className="form-btn2">
                    <div><Link to="/signup" className='newpost'><p>need an account?</p></Link></div>
                    <button >Sign In</button>
                </div>
                
                <ToastContainer />
            </form>
        </div>
         
     )
}
export default Signin;