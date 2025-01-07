import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 

function CounterSection() {
    const [tags, setTags] = useState([]);

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

    return (
        <div className="container mt-3" id='tagContainer'>
            <div className="row">
                <div className="col">
                    <div>
                        {tags.map(tag => (
                            <Link key={tag._id} to={`tagPost/${tag._id}`}>
                                <span
                                    className="badge badge-primary d-block mb-2 mr-2"
                                    style={{ backgroundColor: getRandomColor(), padding: '20px' }}
                                >
                                    {tag.name}
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