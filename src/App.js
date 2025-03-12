import React from 'react'
import Modal from "react-modal";

import './App.css'
import Main from './Components/Main'

// Set the root element for accessibility
Modal.setAppElement("#root");


const App = () => {
	return (
		<Main />
	)
}

export default App