import React, { useState } from 'react'

// CSS imports
import '../CSS/main.css'
import '../CSS/searchResult.css'
import '../CSS/searchInput.css'

// Defining 'ResultDisplay' component
import ResultDisplay from './ResultDisplay'

// Image import
import placeholder from '../images/cc.png'

const Main = () => {
    const [img, setImg] = useState("");
    const [res, setRes] = useState([]);

    // To set limit on initial display
    const [limit, setLimit] = useState(4)

    // Dark Mode State
    const [darkMode, setDarkMode] = useState(false);

    // Toggle Dark Mode
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.body.classList.toggle('dark-mode'); // Add class to <body>
    };

    const fetchRequest = async () => {
        try {
            let allResults = [];
            let page = 1;
            let totalPages = 5; // Adjust this to fetch more pages

            while (page <= totalPages) {
                const response = await fetch(`https://api.unsplash.com/search/photos?page=${page}&query=${img}&client_id=${process.env.REACT_APP_ACCESS_KEY}&per_page=30`);
                
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
        fetchRequest();
        setImg("");
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
                <h2 className='m-0'><b>Unsplash Image Search App</b></h2>

                {/* Dark Mode Toggle Button */}
                <button className="toggle-button" onClick={toggleDarkMode}>
                    {darkMode ? "Light Mode ☀️" : "Dark Mode 🌙"}
                </button>
            </div>

            {/* Section for search field (input) and search button */}
            <form className='searchInput' onSubmit={onFormSubmit}>

                {/* Search field (input) */}
                <input className={`${darkMode ? "dark" : ""}`} type='text' name='photoSearch' placeholder='Type anything and hit enter...' value={img} onChange={(e) => setImg(e.target.value)} />

                {/* Search button */}
                <button type='submit' className='defaultButton' onClick={onSubmit}>
                    <i className="fal fa-search"></i> &nbsp;
                    <span>Search</span>
                </button>
            </form>

            {/* Section where the search result is shown */}
            <div className='searchResult'>
                <div className='resultDisplay'>

                    {/* Images are displayed in grid format */}
                    <div className='viewGrid'>

                        {/* If data exists, then the data are mapped */}
                        {res.length !== 0 ?
                            <div className="row" >
                                {res && res.slice(0, limit).map((val) => (

                                    // Component split up in a different page
                                    <ResultDisplay key={val.id} item={val} darkMode={darkMode} />
                                ))}
                            </div>

                            // If data does not exist, then placeholder texts and image are shown
                            : <center className='text-muted'>
                                <img src={placeholder} alt='placeholder_img'></img><br />
                                <span>Search something to see results</span>
                            </center>
                        }
                    </div>

                    {/* Section to show view more button */}
                    <div className='viewMore'>
                        {res.length > limit &&
                            <center>

                                {/* View more button */}
                                <button type='button' className='defaultButton' onClick={() => setLimit(limit + 4)}>
                                    <i className="fal fa-arrow-down"></i> &nbsp;
                                    <span>View More</span>
                                </button>
                            </center>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Main