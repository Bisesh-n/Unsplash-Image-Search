import React, { useState } from 'react'

// CSS imports
import '../CSS/main.css'
import '../CSS/searchInput.css'

// Defining 'ResultDisplay' component
import ResultDisplay from './ResultDisplay'

// Image import
import placeholder from '../images/placeholder.png'
import loading from '../images/loading.png'
import nothingFound from '../images/nothingFound.gif'

const Main = () => {
    const [img, setImg] = useState("");
    const [res, setRes] = useState([]);

    // To set limit on initial display
    const [limit, setLimit] = useState(8)

    // Dark Mode State
    const [darkMode, setDarkMode] = useState(false);

    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isLoadingImages, setIsLoadingImages] = useState(false);

    const [searchedTerm, setSearchedTerm] = useState("");

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
        setLimit(8);

        setSearchedTerm(img); // Save searched term

        fetchRequest();
        setImg("");

        setIsLoadingImages(true); // Start loading state
        fetchRequest().finally(() => setIsLoadingImages(false)); // Stop loading after fetching
    };


    const clearSearch = () => {
        setRes([]);  // Clear images
        setSearchedTerm(""); // Clear search term
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
                <h5 className='m-0'><b>Unsplash Image Search</b></h5>

                {/* Dark Mode Toggle Button */}
                <div className="toggle-button-group">
                    <button 
                        className={`toggle-button ${!darkMode ? "active" : ""}`} 
                        onClick={() => toggleDarkMode(false)}
                        title="Light Mode"
                    >
                        <i class="fal fa-lightbulb"></i>&nbsp;<span>Light</span>
                    </button>

                    <button 
                        className={`toggle-button ${darkMode ? "active" : ""}`} 
                        onClick={() => toggleDarkMode(true)}
                        title="Dark Mode"
                    >
                        <i className="fal fa-moon"></i>&nbsp;<span>Dark</span>
                    </button>
                </div>
            </div>

            {/* Section for search field (input) and search button */}
            <form className='searchInput' onSubmit={onFormSubmit}>

                {/* Search field (input) */}
                <i className="fas fa-search text-muted"></i>
                <input className={`${darkMode ? "darkInput" : ""}`} type='text' name='photoSearch' placeholder='Type anything and hit enter...' value={img} onChange={(e) => setImg(e.target.value)} />

                {/* Search button */}
                <button type='submit' className='d-none' onClick={onSubmit}></button>
            </form>


            {searchedTerm && (
                <div className='searchedTerm d-flex align-items-center'>
                    Showing results for: &nbsp;
                    <span>
                        {searchedTerm} &nbsp;
                        <i className='fal fa-times' onClick={clearSearch}></i>
                    </span>
                </div>
            )}


            {/* Section where the search result is shown */}
            <div className='resultDisplay'>

                {/* Images are displayed in grid format */}
                <div className='viewGrid'>

                    {/* If data exists, then the data are mapped */}
                    {isLoadingImages ? (
                        // Show loading placeholders while fetching
                        <center>
                            <img src={loading} alt='loading_img' className='placeholderImages'></img>
                        </center>

                    ) : res.length !== 0 ? (
                        <div className='imageResults'>
                            {res.slice(0, limit).map((val) => (
                                <ResultDisplay key={val.id} item={val} darkMode={darkMode} />
                            ))}
                        </div>

                    ) : searchedTerm ? (
                        // If the search was performed but no results found
                        <center>
                            <img src={nothingFound} alt='nothingFound_img' className='placeholderImages'></img>
                            <small className='text-muted'>Nothing found for " <b>{searchedTerm}</b> "</small>
                        </center>

                    ) : (
                        // If data does not exist, then placeholder texts and image are shown
                        <center>
                            <img src={placeholder} alt='placeholder_img' className='placeholderImages mt-5'></img>
                            <small className='text-muted'>Search something to see results</small>
                        </center>
                    )}


                    {/* Section to show view more button */}
                    {res.length > limit && (
                        <center>
                            <button
                                type='button'
                                className={darkMode ? 'btn-dark showMore darkbtn' : 'btn-dark showMore'}
                                onClick={() => {
                                    setIsLoadingMore(true); // Start loading state

                                    setLimit(prevLimit => {
                                        const newLimit = prevLimit + 4;
                                        setTimeout(() => {
                                            const firstNewRow = document.querySelector(`.resultDisplay .imageResults div:nth-child(${prevLimit + 1})`);
                                            if (firstNewRow) {
                                                firstNewRow.scrollIntoView({ behavior: "smooth", block: "start" });
                                            }
                                            setIsLoadingMore(false); // Stop loading state after scroll
                                        }, 100); // Slight delay for smoother UX
                                        
                                        return newLimit;
                                    });
                                }}
                            >
                                {/* <i className="fal fa-arrow-down"></i> &nbsp; */}
                                <span>See more</span>
                            </button>
                        </center>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Main