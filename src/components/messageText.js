import React, { useContext, useState, useEffect } from 'react';
import data from './data';

const DisplayText = () => {

    const [currentIndex, setCurrentIndex] = useState(0);
    const [displayText, setDisplayText] = useState('');

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

    return (
        <div className="container text-center mt-3">
            <h1 className="pb-5 text-bluewhale">{displayText}</h1>
        </div>
    )
}
export default DisplayText;