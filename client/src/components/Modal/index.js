import React from 'react'
import './Modal.css'


export const Modal = ({ showModal }) => {
  
    return (
      <div className='modal_background'>
        <div className='modal_container'>
          <div className='top_x_button'>
            <button onClick={() => showModal(false)}> X </button>
          </div>
          <div className='modal_title'>
            <h1>Title</h1>
          </div>
          <div className='modal_body'>
            <p>Test Body</p>
          </div>
          <div className='modal_footer'>
            <button>Continue</button>
            <button className='cancel_button' onClick={() => showModal(false)}>Cancel</button>
          </div>
        </div>
      </div>
    )
  }
  
  export default Modal;
  
  
  {/* { showModal ? <div>Modal</div> : null } */}