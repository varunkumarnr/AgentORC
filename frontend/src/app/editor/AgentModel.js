import React from "react";
import Icon from "@mdi/react";
import { mdiClose } from "@mdi/js";

const AgentModal = ({ agent, onClose }) => {
  if (!agent) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          <Icon path={mdiClose} size={1} />
        </button>
        <h2 className="text-2xl font-bold mb-4">{agent.role}</h2>
        <p className="text-gray-800">{agent.description}</p>
        {/* Add more agent details here */}
      </div>
    </div>
  );
};

export default AgentModal;
