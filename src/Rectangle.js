// components/Rectangle.js
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import NoteInput from './NoteInput';
import defaultImage from '/Users/manojsuradkar/my-react-app/src/image-removebg-preview 1.png'; // replace with the actual path
import './Rectangle.css';

// Define available color options for the groups
const colorOptions = ['#8e44ad', '#e74c3c', '#3498db', '#d35400', '#34495e', '#5dade2'];

// Rectangle component
const Rectangle = () => {
  // State variables
  const [isModalOpen, setModalOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#8e44ad'); // Default color
  const [groupList, setGroupList] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isNoteInputModalOpen, setNoteInputModalOpen] = useState(false);
  const [notes, setNotes] = useState([]);
  const [newNoteContent, setNewNoteContent] = useState('');

  // useEffect to load groups from local storage on component mount
  useEffect(() => {
    const storedGroups = JSON.parse(localStorage.getItem('groups')) || [];
    setGroupList(storedGroups);
  }, []);

  // useEffect to load notes for the selected group from local storage
  useEffect(() => {
    const storedNotes = JSON.parse(localStorage.getItem(selectedGroup?.name)) || [];
    setNotes(storedNotes);
  }, [selectedGroup]);

  // Open and close modal functions
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  // Open and close note input modal functions
  const openNoteInputModal = () => setNoteInputModalOpen(true);
  const closeNoteInputModal = () => setNoteInputModalOpen(false);

  // Handle creating a new group
  const handleCreateNote = () => {
    const newGroups = [...groupList, { name: groupName, color: selectedColor }];
    setGroupList(newGroups);
    setGroupName('');

    // Save groups to local storage
    localStorage.setItem('groups', JSON.stringify(newGroups));

    closeModal();
  };

  // Handle adding a new note to the selected group
  const handleAddNote = (newNote) => {
    console.log(`Added Note to Group ${selectedGroup?.name}:`, newNote);

    // Save notes to local storage
    const storedNotes = JSON.parse(localStorage.getItem(selectedGroup?.name)) || [];
    const updatedNotes = [...storedNotes, newNote];
    localStorage.setItem(selectedGroup?.name, JSON.stringify(updatedNotes));

    // Update state to trigger re-render with the new notes
    setNotes(updatedNotes);

    closeNoteInputModal();
  };

  // Handle changing the selected group
  const handleGroupChange = (group) => {
    setSelectedGroup(group);
  };

  // Handle updating the content of the new note
  const handleNewNoteChange = (content, e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      // If Enter key is pressed without Shift key, add a new note
      e.preventDefault(); // Prevents a newline character from being inserted
      handleAddNewNote();
    } else {
      setNewNoteContent(content);
    }
  };

  // Handle adding a new note to the selected group
  const handleAddNewNote = () => {
    if (newNoteContent.trim() !== '') {
      const now = new Date();
      const formattedDate = `${now.getDate()} ${now.toLocaleString('default', {
        month: 'long',
      })} ${now.getFullYear()}`;
      const formattedTime = now.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });
      const newNote = {
        content: newNoteContent,
        dateCreated: formattedDate,
        lastUpdated: formattedDate,
        timeCreated: formattedTime,
        timeUpdated: formattedTime,
        groupId: selectedGroup?.name,
      };
      handleAddNote(newNote);
      setNewNoteContent('');
    }
  };

  // Handle clearing local storage
  

  // Render the Rectangle component
  return (
    <div className="rectangle">
      <div className="nested-rectangle">
      <div className="lhs-content">
  <p className="text">Pocket Notes</p>
  <button className="create-note-button" onClick={openModal}>
    + Create Notes Group
  </button>
  {groupList.length > 0 && (
    <div className="group-list">
      <p></p>
      <ul>
        {groupList.map((group, index) => (
          <li key={index} onClick={() => handleGroupChange(group)}>
            <div className="group-name">
              <div className="circle" style={{ backgroundColor: group.color }}>
                <span className="initials">{group.name.substring(0, 2)}</span>
              </div>
              <div className="full-name">{group.name}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )}
        </div>

        <div className="rhs-content">
  {selectedGroup ? (
    <>
      <div className="group-notes">
      <p>
                  <span className="circle" style={{ backgroundColor: selectedGroup.color }}>
                    <span className="initials">{selectedGroup.name.substring(0, 2)}</span>
                  </span>
                  <span className="full-name">{selectedGroup.name}</span>
                </p>
            

         
        <ul>
          {notes.map((note, index) => (
           <li key={index}>
           <div className="note-item">
             <div className="note-time-date">
               <span className="note-time">{note.timeCreated}</span>
               <br />
               <span className="note-date">{note.dateCreated} </span>
             </div>
             <div className="note-content">
               <strong className="note-content-text">{note.content}</strong>
             </div>
           </div>
         </li>
          ))}
        </ul>
      </div>

              {/* Text box for writing new notes */}
              <div className="new-note-box">
                <textarea
                  rows="4"
                  placeholder="Write a new note..."
                  value={newNoteContent}
                  onChange={(e) => handleNewNoteChange(e.target.value, e)}
                  onKeyDown={(e) => handleNewNoteChange(newNoteContent, e)}
                />
 <div className="add-note-arrow" onClick={handleAddNewNote}>
    {/* Replace the button with an arrow icon */}
    &#10148;
  </div>              </div>
            </>
          ) : (
            // Display default image when no group is selected
            <div className="default-image-container">
      <img src={defaultImage} alt="Default" />
      <p className="default-text">Pocket Notes</p>
      <p className="additional-text">
        Send and receive messages without keeping your phone online.<br></br>
        Use Pocket Notes on up to 4 linked devices and 1 mobile phone.
      </p>
      <p className="encrypted-text">end-to-end encrypted</p>

    </div>
  )}

          
        </div>
      </div>

      {/* Modal for Create Group */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Create Group Modal"
        shouldCloseOnOverlayClick={true}
        className="Modal"
      >
        <h2>Create New Notes Group</h2>
        {/* Input for Group Name */}
        <label htmlFor="groupName">Group Name:</label>
        <input
          type="text"
          id="groupName"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <br />
        {/* Color options for the group */}
        <label htmlFor="color">Choose Color:</label>
        <div className="color-options">
          {colorOptions.map((color, index) => (
            <div
              key={index}
              className="color-option"
              style={{ backgroundColor: color }}
              onClick={() => setSelectedColor(color)}
            />
          ))}
        </div>
        <br />
        {/* Button to create the group */}
        <button onClick={handleCreateNote}>Create</button>
      </Modal>

      {/* NoteInput component */}
      <NoteInput
        isModalOpen={isNoteInputModalOpen}
        onModalClose={closeNoteInputModal}
        currentGroup={selectedGroup}
        onAddNote={handleAddNote}
      />
    </div>
  );
};

export default Rectangle;
