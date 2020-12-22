import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const customModalStyles = {
    content: {
      top: '35%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      width: '60%',
      transform: 'translate(-40%, -10%)',
      borderRadius: '10px',
      textAlign: 'center',
      background: 'transparent',
      fontFamily: 'verdana',
      border: 'none',
      transition: '0.2 2000ms ease-in-out'
    },
  };

const InfoWaitModal = (props) => {
    return (
        <div className="InfoWaitModal">
            <Modal isOpen={props.fireInfoModal} style={customModalStyles} closeTimeoutMS={1000}>
                <h2>Please wait untill the current surf is updated...</h2>
            </Modal>
        </div>
    )
}

export default InfoWaitModal;
