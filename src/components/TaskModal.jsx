// import React, { useEffect, useMemo, useState } from 'react';
// import { FiX } from 'react-icons/fi';
// import './../styles/modal.css';

// function TaskModal({ isOpen, onClose, selectedDay, selectedTime, onSave }) {
//   const [subject, setSubject] = useState('');
//   const [topic, setTopic] = useState('');
//   const [priority, setPriority] = useState('Low');
//   const [minutes, setMinutes] = useState('15');

//   const canSave = useMemo(() => {
//     return Boolean(subject.trim() || topic.trim());
//   }, [subject, topic]);

//   useEffect(() => {
//     if (isOpen) return;
//     setSubject('');
//     setTopic('');
//     setPriority('Low');
//     setMinutes('15');
//   }, [isOpen]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (canSave) {
//       onSave({
//         subject: subject.trim(),
//         topic: topic.trim(),
//         priority,
//         minutes: Number(minutes) || 0,
//       });
//       onClose();
//     }
//   };

//   const handleCancel = () => {
//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="modal-overlay" onClick={handleCancel}>
//       <div className="modal-content task-modal modal-wide" onClick={(e) => e.stopPropagation()}>
//         <div className="modal-header">
//           <h2>Add Task</h2>
//           <button type="button" className="modal-close" onClick={handleCancel} aria-label="Close">
//             <FiX />
//           </button>
//         </div>
//         <div className="modal-body">
//           <p className="modal-selection">
//             <strong>Day:</strong> {selectedDay} &nbsp;|&nbsp; <strong>Time:</strong> {selectedTime}
//           </p>
//           <form onSubmit={handleSubmit} className="task-form">
//             <div className="task-form-row">
//               <label htmlFor="task-subject">Subject</label>
//               <input
//                 id="task-subject"
//                 type="text"
//                 value={subject}
//                 onChange={(e) => setSubject(e.target.value)}
//                 placeholder="Maths"
//                 autoFocus
//               />
//             </div>

//             <div className="task-form-row">
//               <label htmlFor="task-topic">Topic</label>
//               <input
//                 id="task-topic"
//                 type="text"
//                 value={topic}
//                 onChange={(e) => setTopic(e.target.value)}
//                 placeholder="Polynomials"
//               />
//             </div>

//             <div className="task-form-row">
//               <label>Priority</label>
//               <div className="priority-pills" role="group" aria-label="Priority">
//                 {['Low', 'Medium', 'High'].map((p) => (
//                   <button
//                     key={p}
//                     type="button"
//                     className={`priority-pill ${priority === p ? 'active' : ''} ${p.toLowerCase()}`}
//                     onClick={() => setPriority(p)}
//                   >
//                     {p}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div className="task-form-row">
//               <label htmlFor="task-minutes">Duration</label>
//               <div className="duration-row">
//                 <input
//                   id="task-minutes"
//                   type="number"
//                   min="0"
//                   step="5"
//                   value={minutes}
//                   onChange={(e) => setMinutes(e.target.value)}
//                 />
//                 <span className="duration-suffix">min</span>
//               </div>
//             </div>
//           </form>
//         </div>
//         <div className="modal-footer">
//           <button type="button" className="btn btn-secondary" onClick={handleCancel}>
//             Cancel
//           </button>
//           <button
//             type="button"
//             className="btn btn-primary"
//             onClick={() => {
//               if (canSave) {
//                 onSave({
//                   subject: subject.trim(),
//                   topic: topic.trim(),
//                   priority,
//                   minutes: Number(minutes) || 0,
//                 });
//                 onClose();
//               }
//             }}
//             disabled={!canSave}
//           >
//             Add Task
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default TaskModal;


// import React, { useEffect, useMemo, useState } from 'react';
// import { FiX } from 'react-icons/fi';
// import './../styles/modal.css';

// function TaskModal({ isOpen, onClose, selectedDay, selectedTime, onSave }) {
//   const [subject, setSubject] = useState('');
//   const [topic, setTopic] = useState('');
//   const [priority, setPriority] = useState('Low');
//   const [minutes, setMinutes] = useState('15');

//   const canSave = useMemo(() => {
//     return Boolean(subject.trim() || topic.trim());
//   }, [subject, topic]);

//   useEffect(() => {
//     if (isOpen) return;
//     setSubject('');
//     setTopic('');
//     setPriority('Low');
//     setMinutes('15');
//   }, [isOpen]);

//   const handleSave = () => {
//     if (!canSave) return;

//     const mins = Number(minutes) || 0;

//     onSave({
//       subject: subject.trim(),
//       topic: topic.trim(),
//       priority,
//       minutes: mins,
//       duration: mins / 60, // 🔥 IMPORTANT
//       __day: selectedDay,
//       __time: selectedTime,
//       completed: false,
//     });

//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="modal-overlay" onClick={onClose}>
//       <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//         <h2>Add Task</h2>

//         <p>
//           <b>{selectedDay}</b> | {selectedTime}
//         </p>

//         <input
//           placeholder="Subject"
//           value={subject}
//           onChange={(e) => setSubject(e.target.value)}
//         />

//         <input
//           placeholder="Topic"
//           value={topic}
//           onChange={(e) => setTopic(e.target.value)}
//         />

//         <input
//           type="number"
//           value={minutes}
//           onChange={(e) => setMinutes(e.target.value)}
//         />

//         <button onClick={handleSave}>Add</button>
//       </div>
//     </div>
//   );
// }

// export default TaskModal;

import React, { useEffect, useMemo, useState } from "react";
import { FiX } from "react-icons/fi";
import "../styles/modal.css"; // ✅ IMPORTANT

function TaskModal({ isOpen, onClose, selectedDay, selectedTime, onSave }) {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [priority, setPriority] = useState("Low");
  const [minutes, setMinutes] = useState("15");

  const canSave = useMemo(() => {
    return Boolean(subject.trim() || topic.trim());
  }, [subject, topic]);

  useEffect(() => {
    if (!isOpen) {
      setSubject("");
      setTopic("");
      setPriority("Low");
      setMinutes("15");
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!canSave) return;

    onSave({
      subject: subject.trim(),
      topic: topic.trim(),
      priority,
      minutes: Number(minutes) || 0,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content modal-wide"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 🔹 Header */}
        <div className="modal-header">
          <h2>Add Task</h2>
          <button className="modal-close" onClick={onClose}>
            <FiX />
          </button>
        </div>

        {/* 🔹 Body */}
        <div className="modal-body">
          <p className="modal-selection">
            <strong>Day:</strong> {selectedDay} |{" "}
            <strong>Time:</strong> {selectedTime}
          </p>

          <div className="task-form">
            {/* Subject */}
            <div className="task-form-row">
              <label>Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Maths"
              />
            </div>

            {/* Topic */}
            <div className="task-form-row">
              <label>Topic</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Algebra"
              />
            </div>

            {/* Priority */}
            <div className="task-form-row">
              <label>Priority</label>
              <div className="priority-pills">
                {["Low", "Medium", "High"].map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={`priority-pill ${
                      priority === p ? "active" : ""
                    }`}
                    onClick={() => setPriority(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div className="task-form-row">
              <label>Duration</label>
              <div className="duration-row">
                <input
                  type="number"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                />
                <span className="duration-suffix">min</span>
              </div>
            </div>
          </div>
        </div>

        {/* 🔹 Footer */}
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>

          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={!canSave}
          >
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskModal;