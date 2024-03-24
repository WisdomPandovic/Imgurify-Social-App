import React, { useContext, useState } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { ImgurContext } from './Context/ImgurContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const SocialNav = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(ImgurContext);
  const navigate = useNavigate();

  const handleNewPostClick = () => {
    if (isLoggedIn) {
      navigate("/newposts");
    } else {
      alert("You need to sign in to create a post.");
      toast.error("You need to sign in to create a post.");
      navigate("/signin");
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('Imgur_USER');
      setIsLoggedIn(false);
      navigate("/");
      toast.success("Logged out successfully.");
    } catch (error) {
      console.error('Error while handling logout:', error);
      toast.error("Failed to logout. Please try again.");
    }
  };

  // Get username from local storage
  const getUsername = () => {
    const userData = JSON.parse(localStorage.getItem('Imgur_USER'));
    return userData ? userData.user.username : '';
  };
  
  return (
    <div className="social-nav">
      <Navbar expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <h1 className="text-secondary">Imgurify</h1>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarNav" />
            {isLoggedIn ? (
          <Navbar.Collapse id="navbarNav">
            <Nav className="mx-auto">
             
                <div className='welcome-note'>
                  <p className='newpost text-white pt-2'>Welcome, <span className='text-info'>{getUsername()}</span>! You are logged in.</p>
                  <Nav.Link onClick={handleNewPostClick} className="text-white">New Post</Nav.Link>
                </div>
            </Nav>
            <div className="d-flex my-2 my-lg-0">
              <Button as={Link} to="/adfree" variant="outline-light" className="navBar-btn mr-2 border-none">Go Ad-Free</Button>
              <Button onClick={handleLogout} variant="outline-light" className="navBar-btn-logout mr-2 border-none">Logout</Button>
            </div>
          </Navbar.Collapse>
             ) : (
          <Navbar.Collapse id="navbarNav">
            <Nav className="mx-auto">
                <React.Fragment>
                  <Nav.Link onClick={handleNewPostClick} className="text-white">New Post</Nav.Link>
                  <Nav.Link as={Link} to="/signin" className="text-white">Sign In</Nav.Link>
                  <Nav.Link as={Link} to="/signup" className="text-white">Sign Up</Nav.Link>
                </React.Fragment>
            </Nav>
            <div className="d-flex my-2 my-lg-0">
              <Button as={Link} to="/adfree" variant="outline-light" className="navBar-btn border-none">Go Ad-Free</Button>
            </div>
          </Navbar.Collapse>
 )}
        </Container>
      </Navbar>

      <div className="container text-center mt-3">
        <h1 className="pb-5 text-bluewhale">When life gives you lemons, make memes.</h1>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SocialNav;