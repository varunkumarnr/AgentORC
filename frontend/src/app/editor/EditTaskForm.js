import React, { useState } from "react";

const EditTaskForm = ({ isOpen, onClose, task, onSave }) => {
  const [editedTask, setEditedTask] = useState(task);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTask({ ...editedTask, [name]: value });
  };

  const handleSave = () => {
    onSave(editedTask);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-1/3">
        <h2 className="text-lg font-bold mb-4">Edit Task - {task.agent}</h2>
        <div className="mb-4">
          <label
            htmlFor="task"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Task Description
          </label>
          <textarea
            id="task"
            name="task"
            value={editedTask.task}
            onChange={handleInputChange}
            rows="6" // Increase rows for larger textarea
            className="w-full border border-gray-300 rounded-md p-2 resize-none"
            placeholder="Enter task description"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-gradient-to-r from-[#8f2cff] to-[#3d27c5] text-white px-4 py-2 rounded shadow-md  hover:bg-gradient-to-r hover:from-[#3d27c5] hover:to-[#8f2cff] transition-all duration-300"          
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTaskForm;
