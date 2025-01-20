import React from "react";
import CounterSection from "../CounterSection";
import PostsSection from "../PostsSection";

function Post(){
    return(
        <div className="container-fluid post-bk">
            <div className="row">
                <div className="col-md-2">
                <CounterSection/>
                </div>
                <div className="col-md-8">
                    <PostsSection/>
                </div>
                <div className="col-md-2">
                </div>
            </div>
        </div>
    )
}
export default Post;