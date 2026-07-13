import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
import './../styles/modal.css';

function ResourceModal({ isOpen, onClose, onSubmit }) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSubmit(message.trim());
      setMessage('');
      onClose();
    }
  };

  const handleCancel = () => {
    setMessage('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-content resource-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Request Resources</h2>
          <button type="button" className="modal-close" onClick={handleCancel} aria-label="Close">
            <FiX />
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <label htmlFor="resource-message">Your request</label>
            <textarea
              id="resource-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe the resource you need..."
              rows={4}
            />
          </form>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              if (message.trim()) {
                onSubmit(message.trim());
                setMessage('');
                onClose();
              }
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResourceModal;
