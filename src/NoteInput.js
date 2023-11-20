// components/NoteInput.js
import React, { useState } from 'react';
import Modal from 'react-modal';

const NoteInput = ({ isModalOpen, onModalClose, currentGroup, onAddNote }) => {
  const [inputValue, setInputValue] = useState('');

  const handleNoteAdd = () => {
    if (inputValue.trim() !== '') {
      const now = new Date();
      const newNote = {
        content: inputValue,
        dateCreated: now.toLocaleString(),
        lastUpdated: now.toLocaleString(),
        groupId: currentGroup,
      };
      onAddNote(newNote);
      setInputValue('');
      onModalClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNoteAdd();
    }
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={onModalClose}
      contentLabel="Create Note"
    >
      <textarea
        rows="4"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter note content"
      />
      <button onClick={handleNoteAdd}>Add Note</button>
    </Modal>
  );
};

export default NoteInput;
