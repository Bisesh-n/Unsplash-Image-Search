import React, { useState } from 'react'

// CSS imports
import '../CSS/main.css'
import '../CSS/searchInput.css'

// Defining 'ResultDisplay' component
import ResultDisplay from './ResultDisplay'

// Image import
import placeholder from '../images/placeholder.png'
import loading from '../images/loading.png'

const Main = () => {
    const [img, setImg] = useState("");
    const [res, setRes] = useState([]);

    // To set limit on initial display
    const [limit, setLimit] = useState(6)

    // Dark Mode State
    const [darkMode, setDarkMode] = useState(false);

    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isLoadingImages, setIsLoadingImages] = useState(false);

    // Toggle Dark Mode
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.body.classList.toggle('dark-mode'); // Add class to <body>
    };

    const fetchRequest = async () => {
        try {
            let allResults = [];
            let page = 1;
            let totalPages = 3; // Adjust this to fetch more pages

            while (page <= totalPages) {
                const response = await fetch(`https://api.unsplash.com/search/photos?page=${page}&query=${img}&client_id=${process.env.REACT_APP_ACCESS_KEY}&per_page=50`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
                const data = await response.json();
                allResults = [...allResults, ...data.results];
                console.log(`Page ${page} fetched!`);
                page++;
            }
            
            setRes(allResults);
            console.log(allResults);
        } catch (error) {
            console.error("Error fetching images:", error);
        }
    };

    // Function to fetch results and empty the search field
    const onSubmit = () => {
        if (!img.trim()) return;

        setRes([]);   // Clear previous results
        setLimit(6);

        fetchRequest();
        setImg("");

        setIsLoadingImages(true); // Start loading state

    fetchRequest().finally(() => setIsLoadingImages(false)); // Stop loading after fetching
    };

    // To prevent reloding
    const onFormSubmit = e => {
        e.preventDefault();
    }

    return (

        // main enclosing div
        <div className='main'>

            {/* Main title */}
            <div className='projTitle d-flex align-items-center justify-content-between'>
                <h5 className='m-0'><b>Unsplash Image Search App</b></h5>

                {/* Dark Mode Toggle Button */}
                <button className="toggle-button" title={darkMode ? "switch to light mode" : "switch to darkmode"} onClick={toggleDarkMode}>
                    {darkMode ? "☀️" : "🌙"}
                </button>
            </div>

            {/* Section for search field (input) and search button */}
            <form className='searchInput' onSubmit={onFormSubmit}>

                {/* Search field (input) */}
                <i className="fas fa-search text-muted"></i>
                <input className={`${darkMode ? "dark" : ""}`} type='text' name='photoSearch' placeholder='Type anything and hit enter...' value={img} onChange={(e) => setImg(e.target.value)} />

                {/* Search button */}
                <button type='submit' className='d-none' onClick={onSubmit}></button>
            </form>



            {/* Section where the search result is shown */}
            <div className='resultDisplay'>

                {/* Images are displayed in grid format */}
                <div className='viewGrid'>

                    {/* If data exists, then the data are mapped */}
                    {isLoadingImages ? (
                        // Show loading placeholders while fetching
                        <center className='text-muted'>
                            <img src={loading} alt='loading_img' className='placeholderImages'></img><br />
                            <span>Loading results</span>
                        </center>

                    ) : res.length !== 0 ? (
                        <div className='row'>
                            {res.slice(0, limit).map((val) => (
                                <ResultDisplay key={val.id} item={val} darkMode={darkMode} />
                            ))}
                        </div>
                    ) : (
                        // If data does not exist, then placeholder texts and image are shown
                        <center className='text-muted'>
                            <img src={placeholder} alt='placeholder_img' className='placeholderImages'></img><br />
                            <span>Search something to see results</span>
                        </center>
                    )}


                    {/* Section to show view more button */}
                    {res.length > limit && (
                        <center>
                            {isLoadingMore ? (
                                // Show loading text while fetching images
                                <button className='btn-info defaultButton'>Loading...</button>
                            ) : (
                                <button
                                    type='button'
                                    className='btn-primary defaultButton'
                                    onClick={() => {
                                        setIsLoadingMore(true); // Start loading state

                                        setLimit(prevLimit => {
                                            const newLimit = prevLimit + 6;
                                            setTimeout(() => {
                                                const firstNewRow = document.querySelector(`.resultDisplay .row div:nth-child(${prevLimit + 1})`);
                                                if (firstNewRow) {
                                                    firstNewRow.scrollIntoView({ behavior: "smooth", block: "start" });
                                                }
                                                setIsLoadingMore(false); // Stop loading state after scroll
                                            }, 500); // Slight delay for smoother UX
                                            
                                            return newLimit;
                                        });
                                    }}
                                >
                                    {/* <i className="fal fa-arrow-down"></i> &nbsp; */}
                                    <span>see more</span>
                                </button>
                            )}
                        </center>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Main