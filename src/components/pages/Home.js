import Nav from "../Nav";
import Posts from "./Posts";

function Home(){
    return(
        <div className="homepage">
            <Nav />
            
            <Posts/>
            
        </div>
    );
}
export default Home;