// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom'; 

// function CounterSection() {
//     const [tags, setTags] = useState([]);

//     useEffect(() => {
//         fetchTags();
//     }, []);

//     const fetchTags = async () => {
//         try {
//             const response = await fetch('https://imgurif-api.onrender.com/api/tag');
//             const data = await response.json();
//             setTags(data);
//         } catch (error) {
//             console.error('Error fetching tags:', error);
//         }
//     };

//     const getRandomColor = () => {
//         // Generate random color in hexadecimal format
//         return '#' + Math.floor(Math.random()*16777215).toString(16);
//     };

//     return (
//         <div className="container mt-3" id='tagContainer'>
//             <div className="row">
//                 <div className="col">
//                     <div>
//                         {tags.map(tag => (
//                             <Link key={tag._id} to={`tagPost/${tag._id}`}>
//                                 <span
//                                     className="badge badge-primary d-block mb-2 mr-2"
//                                     style={{ backgroundColor: getRandomColor(), padding: '20px' }}
//                                 >
//                                     {tag.name}<br></br>
//                                     <span className="badge badge-light ml-2">
//                                     {tag.post.length} posts
//                                     </span>
//                                 </span>
//                             </Link>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default CounterSection;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 

function CounterSection() {
    const [tags, setTags] = useState([]);
    const [startIndex, setStartIndex] = useState(0); // Track the start index for displayed tags
    const [endIndex, setEndIndex] = useState(7); // Track the end index for displayed tags

    useEffect(() => {
        fetchTags();
    }, []);

    const fetchTags = async () => {
        try {
            const response = await fetch('https://imgurif-api.onrender.com/api/tag');
            const data = await response.json();
            setTags(data);
        } catch (error) {
            console.error('Error fetching tags:', error);
        }
    };

    const getRandomColor = () => {
        // Generate random color in hexadecimal format
        return '#' + Math.floor(Math.random()*16777215).toString(16);
    };

    const handleShowMore = () => {
        setStartIndex(prevIndex => prevIndex + 7); // Increment the start index by 7
        setEndIndex(prevIndex => prevIndex + 7); // Increment the end index by 7
    };

    const handleShowLess = () => {
        setStartIndex(prevIndex => Math.max(prevIndex - 7, 0)); // Decrement the start index by 7 (minimum 0)
        setEndIndex(prevIndex => Math.max(prevIndex - 7, 7)); // Decrement the end index by 7 (minimum 7)
    };

    // Get the tags to display based on startIndex and endIndex
    const displayedTags = tags.slice(startIndex, endIndex);

    return (
        <div className="container mt-3" id='tagContainer'>
            <div className="row">
                <div className="col">
                    {/* Button to load more tags or show less */}
                    {endIndex < tags.length ? (
                        <button 
                            onClick={handleShowMore} 
                            className="btn btn-link mt-3 mb-2"
                            style={{ color: '#fff', borderColor: '#ccc', textDecoration: 'none' }}
                        >
                            More Tags
                        </button>
                    ) : (
                        startIndex > 0 && (
                            <button 
                                onClick={handleShowLess} 
                                className="btn btn-link mt-3 mb-2"
                                style={{ color: '#fff', borderColor: '#ccc', textDecoration: 'none' }}
                            >
                                Show Less
                            </button>
                        )
                    )}
                    <div>
                        {displayedTags.map(tag => (
                            <Link key={tag._id} to={`tagPost/${tag._id}`}>
                                <span
                                    className="badge badge-primary d-block mb-2 mr-2"
                                    style={{ backgroundColor: getRandomColor(), padding: '20px' }}
                                >
                                    {tag.name}<br />
                                    <span className="badge badge-light ml-2">
                                        {tag.post.length} posts
                                    </span>
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CounterSection;
