import React, { useContext, useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { ImgurContext } from './Context/ImgurContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { FaEnvelope, FaBell, FaSignOutAlt } from 'react-icons/fa';
import Notification from "../components/Notification";
import data from './data';
import Modal from 'react-bootstrap/Modal'; // Import Modal

const SocialNav = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(ImgurContext);
  const navigate = useNavigate();
  const [isBarOpen, setIsBarOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleNewPostClick = () => {
    if (isLoggedIn) {
        navigate("/newposts");
    } else {
        toast.error("You need to sign in to create a post.");
        setTimeout(() => {
            navigate("/signin");
        }, 3000); // Adjust delay as needed, in milliseconds
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

  const updateText = () => {
    // console.log(`Current Index: ${currentIndex}`); // Log the current index
    // console.log(`Displaying Text: ${data[currentIndex]}`); // Log the text being displayed

    // Set the current text to display
    setDisplayText(data[currentIndex]);
  };

  useEffect(() => {
    // Initial text display
    updateText(); // Display the first item

    // Set interval for text change
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % data.length; // Calculate the next index
        // console.log(`Next Index: ${nextIndex}`); // Log the next index
        return nextIndex; // Update current index
      });
    }, 5000); // 10000ms = 10 seconds

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []); // Run this effect only once on mount

  // Update the display text whenever currentIndex changes
  useEffect(() => {
    updateText(); // Call the updateText function when currentIndex changes
  }, [currentIndex]); // Add currentIndex to dependency array

  const handleShowModal = () => setShowModal(true); // Function to show modal
  const handleCloseModal = () => setShowModal(false);

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
                  <p className='newpost text-white pt-2'>Welcome, <span className='text-info'>{getUsername()}</span> !</p>

                  <Nav.Link onClick={handleNewPostClick} className="text-white">New Post</Nav.Link>
                </div>
              </Nav>
              <div className="d-flex my-2 my-lg-0">
                <FaEnvelope className='nav-icons text-white' style={{ fontSize: '30px' }}  onClick={handleShowModal}/>
                <FaBell onClick={() => setIsBarOpen(true)} className='nav-icons text-white' style={{ fontSize: '30px' }} />
                <FaSignOutAlt onClick={handleLogout} className='nav-icons text-danger' style={{ fontSize: '30px' }} />
              </div>
              {isBarOpen && (
                <div className='barPopup'>
                  <div className='popup-flex'>
                    <div className='popup-welcome'>Notifications</div>
                    <div onClick={() => setIsBarOpen(false)} className='popup-welcomeX'>X</div>
                  </div>

                  <div className='notification'>
                    <Notification />
                  </div>

                </div>
              )}
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
        <h1 className="pb-5 text-bluewhale">{displayText}</h1>
      </div>

       {/* Modal */}
       <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Hold up!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>You do not currently have access to this feature yet. Participate in the Community, and you'll be chatting in no time!</p>
          <p>Think this is an error? We're here to help.</p>
        </Modal.Body>
        <Modal.Footer className="custom-footer">
          <Button variant="success" onClick={handleCloseModal}>Close</Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default SocialNav;