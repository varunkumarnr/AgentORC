import React, { useState } from "react";
import { Icon } from "@mdi/react";
import { mdiClose } from "@mdi/js";

const AgentFormModal = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    agent_type: "",
    Backstory: "",
    description: "",
    Goal: "",
    id: "",
    LLM: "",
    Prompt_Template: "",
    Response_Template: "",
    Role: "",
    System_Template: "",
    Tools: "",
    save_memory: "",
    type: "agent",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let cleanedValue = value;

    if (name === "id") {
      cleanedValue = value.replace(/\s+/g, "");

      cleanedValue = cleanedValue.replace(/[^a-zA-Z]/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: cleanedValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    onCreate(formData);
  };

  const isAgentTypeSelected = () => {
    return formData.agent_type !== "";
  };

  const renderRoleBasedFields = () => (
    <>
      <div className="mb-4">
        <label className="block text-gray-700">Backstory</label>
        <textarea
          name="Backstory"
          value={formData.Backstory}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows="3"
          required
          placeholder="With a background in software architecture and system design, the tech design agent has extensive experience in designing systems that integrate multiple technologies. It draws upon a wealth of knowledge in cloud computing, data architecture, and API integration to create robust solutions."
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows="3"
          required
          placeholder="A specialized AI agent focused on designing technical solutions and architectures for complex systems."
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Goal</label>
        <textarea
          name="Goal"
          value={formData.Goal}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows="3"
          required
          placeholder="To design and propose technical solutions that align with the project requirements and constraints, ensuring scalability, security, and performance"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Role</label>
        <input
          type="text"
          name="Role"
          value={formData.Role}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Tech Design Agent"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Id</label>
        <input
          type="text"
          name="id"
          value={formData.id}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="tech_design_agent"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">LLM</label>
        <div className="flex space-x-2">
          {[
            {
              url: "https://cdn.prod.website-files.com/630d4d1c4a462569dd189855/6584a9975ade35940f95e9ba_2.webp",
              text: "Gemini",
            },
            {
              url: "data:image/png;base64,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",
              text: "PSChat",
            },
            {
              url: "https://logodownload.org/wp-content/uploads/2023/04/openai-logo-0.png",
              text: "OpenAI",
            },
          ].map((item, index) => (
            <div
              key={index}
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  LLM: item.text,
                }));
              }}
              className={`relative cursor-pointer border rounded-lg overflow-hidden ${
                formData.LLM === item.text
                  ? "border-orange-500 shadow-lg shadow-orange-300"
                  : "border-gray-300"
              } hover:border-orange-400 hover:shadow-md hover:shadow-orange-300 transition-all duration-300`}
              style={{ width: "80px", height: "80px" }}
            >
              <img
                src={item.url}
                alt={`LLM ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Prompt Template</label>
        <textarea
          name="Prompt_Template"
          value={formData.Prompt_Template}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          row="3"
          placeholder="Any Key points you need agent to be aware of."
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Response Template</label>
        <textarea
          row="3"
          name="Response_Template"
          value={formData.Response_Template}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="How should your reponse be..."
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">System Template</label>
        <textarea
          row="3"
          name="System_Template"
          value={formData.System_Template}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Generic rules that should be followed by agent..."
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Save Memory</label>
        <select
          name="save_memory"
          value={formData.save_memory}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="Y">Yes</option>
          <option value="N">No</option>
        </select>
      </div>
    </>
  );

  const renderReactLegecyFields = () => (
    <>
      <div className="mb-4">
        <label className="block text-gray-700">Id</label>
        <input
          type="text"
          name="id"
          value={formData.id}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Role</label>
        <input
          type="text"
          name="Role"
          value={formData.Role}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Tech Design Agent"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows="3"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">LLM</label>
        <div className="flex space-x-2">
          {[
            {
              url: "https://cdn.prod.website-files.com/630d4d1c4a462569dd189855/6584a9975ade35940f95e9ba_2.webp",
              text: "Gemini",
            },
            {
              url: "data:image/png;base64,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",
              text: "PSChat",
            },
            {
              url: "https://logodownload.org/wp-content/uploads/2023/04/openai-logo-0.png",
              text: "OpenAI",
            },
          ].map((item, index) => (
            <div
              key={index}
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  LLM: item.text,
                }));
              }}
              className={`relative cursor-pointer border rounded-lg overflow-hidden ${
                formData.LLM === item.text
                  ? "border-orange-500 shadow-lg shadow-orange-300"
                  : "border-gray-300"
              } hover:border-orange-400 hover:shadow-md hover:shadow-orange-300 transition-all duration-300`}
              style={{ width: "80px", height: "80px" }}
            >
              <img
                src={item.url}
                alt={`LLM ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Tools</label>

        <div className="flex flex-wrap gap-2 mb-2">
          {formData.Tools &&
            formData.Tools.split(",").map((tool, index) => (
              <div
                key={index}
                className="flex items-center bg-gray-200 px-2 py-1 rounded-full shadow-md"
              >
                <span className="mr-2">{tool}</span>
                <button
                  type="button"
                  onClick={() => {
                    const updatedTools = formData.Tools.split(",")
                      .filter((t) => t !== tool)
                      .join(",");
                    setFormData((prev) => ({
                      ...prev,
                      Tools: updatedTools,
                    }));
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <Icon path={mdiClose} size={0.8} />
                </button>
              </div>
            ))}
        </div>

        <select
          name="tools"
          multiple
          value={formData.Tools ? formData.Tools.split(",") : []}
          onChange={(e) => {
            const selectedTools = Array.from(e.target.selectedOptions).map(
              (option) => option.value
            );

            const existingTools = formData.Tools
              ? formData.Tools.split(",")
              : [];
            const updatedTools = Array.from(
              new Set([...existingTools, ...selectedTools])
            ); // Avoid duplicates

            setFormData((prev) => ({
              ...prev,
              Tools: updatedTools.join(","),
            }));
          }}
          className="w-full p-2 border rounded"
          size={5}
        >
          <option value="TavilySearchResults">TavilySearchResults</option>
          <option value="DuckDuckGo">DuckDuckGo</option>
          <option value="JiraToolkit">JiraToolkit</option>
          <option value="GmailToolkit(Still Testing)">
            GmailToolkit (Still Testing)
          </option>
          <option value="multiply">multiply</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Save Memory</label>
        <select
          name="save_memory"
          value={formData.save_memory}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="Y">Yes</option>
          <option value="N">No</option>
        </select>
      </div>
    </>
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg overflow-y-auto h-[90vh] relative custom-scrollbar">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
        >
          <Icon path={mdiClose} size={1.2} />
        </button>
        <h2 className="text-xl font-bold mb-4 red-color">Create New Agent</h2>
        <form onSubmit={handleSubmit} className="space-y-4- flex flex-col">
          <div className="mb-4">
            <label className="block text-gray-700">Agent Type</label>
            <div className="flex space-x-4">
              {["Role-Based", "ReAct", "Legecy-ReAct"].map((type) => (
                <div
                  key={type}
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      agent_type: type,
                      Backstory: type === "Role-Based" ? "" : prev.Backstory,
                      description:
                        type === "Role-Based" ? "" : prev.description,
                      Goal: type === "Role-Based" ? "" : prev.Goal,
                      id: "",
                      LLM:
                        type === "ReAct" || type === "Legecy-ReAct"
                          ? ""
                          : prev.LLM,
                      Prompt_Template:
                        type === "Role-Based" ? "" : prev.Prompt_Template,
                      Response_Template:
                        type === "Role-Based" ? "" : prev.Response_Template,
                      Role: "",
                      System_Template:
                        type === "Role-Based" ? "" : prev.System_Template,
                      Tools:
                        type === "ReAct" || type === "Legecy-ReAct"
                          ? ""
                          : prev.Tools,
                      save_memory: prev.save_memory,
                    }));
                  }}
                  className={`cursor-pointer p-4 border rounded-lg text-center transition-all duration-300 ${
                    formData.agent_type === type
                      ? "bg-gradient-to-r from-pink-400 to-orange-300 text-white"
                      : "bg-white text-gray-800"
                  } hover:bg-gradient-to-r hover:bg-gradient-to-br from-pink-400 to-orange-300 hover:text-white`}
                >
                  {type}
                </div>
              ))}
            </div>
          </div>

          {formData.agent_type === "Role-Based" && renderRoleBasedFields()}
          {(formData.agent_type === "ReAct" ||
            formData.agent_type === "Legecy-ReAct") &&
            renderReactLegecyFields()}

          <button
            type="submit"
            className="bg-gradient-to-r from-[#8f2cff] to-[#3d27c5] text-white px-4 py-2 rounded-full shadow-md  hover:bg-gradient-to-r hover:from-[#3d27c5] hover:to-[#8f2cff] transition-all duration-300 m-auto disabled:cursor-not-allowed"
            disabled={!isAgentTypeSelected()}
          >
            Create Agent
          </button>
        </form>
      </div>
    </div>
  );
};

export default AgentFormModal;
