import SocialNav from "../SocialNav"
import Post from "./Post";

function Home(){
    return(
        <div className="homepage">
            <SocialNav/>
            <Post/> 
        </div>
    );
}
export default Home;