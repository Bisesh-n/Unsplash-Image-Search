import React, { useState } from 'react'
import Modal from "react-modal"

// CSS imports
import '../CSS/resultDisplay.css'



const ResultDisplay = (props) => {

    // object destructuring
    const { alt_description, urls, likes, width, height, user } = props.item

    // State for modal visibility
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    if (!urls || !urls.regular) {
        return null; // Prevents error if URLs are missing
    }

    

    return ( 
        <div className='col-md-6 col-lg-4 col-xl-4 mb-4'>

            {/* Bootstrap 'Card' component for ease of use */}
            <div className={`card ${props.darkMode ? "dark" : ""}`}>
                <img src={urls.regular} className='card-img-top' alt={alt_description} onClick={() => setIsModalOpen(true)}/>


                <div className='card-body text-center p-3'>
                    <p className='card-title text-capitalize fs-6'>{alt_description}</p><br/>

                    <small className='fs-9'>
                        <i className='fas fa-heart'></i> {likes} &emsp;
                        <i className="fal fa-copy"></i> {width} x {height} &emsp;
                        <i className="fal fa-user"></i> {user.name}
                    </small>
                </div>
            </div>


            {/* Modal Component */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel="Full Image"
                className="modal-content"
                overlayClassName="modal-overlay"
            >
                <button className="close-btn" onClick={() => setIsModalOpen(false)}>✖</button>
                <img src={urls.full} alt={alt_description} className="modal-image" />
            </Modal>
        </div>
    )
}


export default ResultDisplay