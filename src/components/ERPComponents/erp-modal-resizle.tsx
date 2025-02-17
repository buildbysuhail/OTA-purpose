import React, { useState } from "react";
import ReactModal from "react-modal-resizable-draggable"; // Try changing import if needed
import './sssdsd.css'

interface ERPModalProps {
  initWidth?: number;
  initHeight?: number;
}

const ERPModalResizable: React.FC<ERPModalProps> = React.memo(({ initWidth = 800, initHeight = 400 }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  return (
    <div className="App">
      <button onClick={openModal}>Open modal</button>
      {/* Explicitly cast ReactModal if TypeScript still complains */}
      <ReactModal
        initWidth={initWidth}
        initHeight={initHeight}
        onFocus={() => console.log("Modal is clicked")}
        className=""
        onRequestClose={closeModal}
        isOpen={modalIsOpen}
        {...({} as any)} // Temporary workaround if TypeScript still complains
      >
        <div>
          <h3>My Modal</h3>
          <div className="body">
            <p>This is the modal's body.</p>
          </div>
          <button onClick={closeModal}>Close modal</button>
        </div>
      </ReactModal>
    </div>
  );
});

export default ERPModalResizable;