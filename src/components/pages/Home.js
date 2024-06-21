import React, { useContext } from 'react';
import SocialNav from "../SocialNav"
import Post from "./Post";
import { ImgurContext } from '../Context/ImgurContext';
import { FaArrowUp } from 'react-icons/fa';

function Home({ uploadedImageUrl }) {
    const { scrollToTop, isVisible } = useContext(ImgurContext);
    return (
        <div className="homepage">
            <SocialNav />
            <Post />
            {uploadedImageUrl && <img src={uploadedImageUrl} alt="Uploaded" />}
            <div className="back-to-top" onClick={scrollToTop} style={{ display: isVisible ? 'block' : 'none' }}>
                <FaArrowUp className='FaArrowUp' />
            </div>
        </div>
    );
}
export default Home;