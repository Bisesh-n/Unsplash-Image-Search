import React, { useState } from 'react'
import Modal from 'react-modal'

// CSS imports
import '../CSS/resultDisplay.css'



const ResultDisplay = (props) => {

    // object destructuring
    const { alt_description, urls, width, height } = props.item

    // State for modal visibility
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    if (!urls || !urls.regular) {
        return null; // Prevents error if URLs are missing
    }


    // Function to handle image download
    const handleDownload = async () => {
        try {
            const response = await fetch(urls.full);
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
    
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = `${alt_description || 'image'}.jpg`; // Default name
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Error downloading the image:', error);
        }
    };

    

    return ( 
        <div className='col-md-6 col-lg-4 col-xl-4 mb-4'>

            {/* Bootstrap 'Card' component for ease of use */}
            <div className={`card ${props.darkMode ? 'dark' : ''}`}>
                <div className='card-img'>
                    <img src={urls.regular} className='card-img-top' alt={alt_description} onClick={() => setIsModalOpen(true)}/>
                </div>

                <div className='card-body text-center p-3'>
                    <p className='card-title text-capitalize'>{alt_description}</p><br/>

                    <span title='resolution'>
                        <i className='fad fa-copy'></i> {width} x {height} &emsp;
                    </span>
                </div>
            </div>


            {/* Modal Component */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel='Full Image'
                className='modal-content'
                overlayClassName='modal-overlay'>

                <button className='close-btn' title='close image' data-bs-toggle='tooltip' data-bs-placement='top' onClick={() => setIsModalOpen(false)}>
                    <i className='fas fa-close'></i>
                </button>

                <button className='download-btn' title='download image' onClick={handleDownload}>
                    <i className='fas fa-download'></i>
                </button>

                <img src={urls.full} alt={alt_description} className='modal-image' />
            </Modal>
        </div>
    )
}


export default ResultDisplay