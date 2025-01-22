import React from "react";
import CounterSection from "../CounterSection";
import PostsSection from "../PostsSection";

function Post() {
    return (
        <div className="container-fluid post-bk">
            <div className="row">
                <div className="col-md-2">
                    <CounterSection />
                </div>
                <div className="col-md-8">
                    <PostsSection />
                </div>
                <div className="col-md-2 mt-3" id='postContainer'>
                    <a href="/most-popular" className="btn btn-primary">
                        Popular Post
                    </a>
                    <a href="/most-popular" className="btn btn-success mt-2">
                        Newest Post
                    </a>
                </div>
            </div>
        </div>
    )
}
export default Post;