"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { agentORCURL } from "../../config/URLConstants";
import Icon from "@mdi/react";
import {
  mdiChevronRightCircle,
  mdiChevronLeftCircle,
  mdiPlus,
  mdiPencil,
  mdiDelete,
  mdiPlay,
  mdiChevronUp,
  mdiChevronDown,
} from "@mdi/js";
import AgentModal from "./AgentModel";
import AgentFormModal from "./AgentFormModal";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import EditTaskForm from "./EditTaskForm";
import { getTasks } from "@/services/get-tasks";
import { useQueryContext } from "@/context/QueryContext";
import { useRelatedQAContext } from "@/context/RelatedQAContext";
import { getMemory } from "@/services/get-memory";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

{
  /*
    BEWARE!!! Beema is guarding the code. Do not edit.
             ____,'`-, 
      _,--'   ,/::.; 
   ,-'       ,/::,' `---.___        ___,_ 
   |       ,:';:/        ;'"`;"`--./ ,-^.;--. 
   |:     ,:';,'         '         `.   ;`   `-. 
    \:.,:::/;/ -:.                   `  | `     `-. 
     \:::,'//__.;  ,;  ,  ,  :.`-.   :. |  ;       :. 
      \,',';/O)^. :'  ;  :   '__` `  :::`.       .:' ) 
      |,'  |\__,: ;      ;  '/O)`.   :::`;       ' ,' 
           |`--''            \__,' , ::::(       ,' 
           `    ,            `--' ,: :::,'\   ,-' 
            | ,;         ,    ,::'  ,:::   |,' 
            |,:        .(          ,:::|   ` 
            ::'_   _   ::         ,::/:|  
           ,',' `-' \   `.      ,:::/,:| 
          | : _  _   |   '     ,::,' ::: 
          | \ O`'O  ,',   ,    :,'   ;:: 
           \ `-'`--',:' ,' , ,,'      :: 
            ``:.:.__   ',-','        ::' 
  -Beema-      `--.__, ,::.         ::' 
                   |:  ::::.       ::' 
                   |:  ::::::    ,::' 
  */
}

const Editor = () => {
  const [agentspipeline, setAgentspipeline] = useState([]);
  const [agents, setAgents] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(null);
  const [previousResponse, setPreviousResponse] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [responses, setResponses] = useState({});
  const [alertTimeouts, setAlertTimeouts] = useState({});
  const { query } = useQueryContext();
  const { relatedQA } = useRelatedQAContext();
  const router = useRouter();

  const toggleDropdown = (agent) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [agent]: !prev[agent],
    }));
  };
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedAgents = Array.from(agentspipeline);
    const [movedAgent] = reorderedAgents.splice(result.source.index, 1);
    reorderedAgents.splice(result.destination.index, 0, movedAgent);

    setAgentspipeline(reorderedAgents);
  };

  const fetchAgents = async () => {
    try {
      const res = await axios.get(agentORCURL + "list-agents");
      const agentsData = res.data;
      agentsData.sort((a, b) => a.role.localeCompare(b.role));
      setAgents(agentsData);
    } catch (error) {
      console.error("Error fetching agents:", error);
    }
  };

  useEffect(() => {
    const uuid = sessionStorage.getItem("uuid");
    if (query && relatedQA) {
      const data = {
        uuid: uuid,
        requirement: query,
        input_data: relatedQA,
      };
      getTasks(data)
        .then((response) => {
          const filteredResponse = response.filter(
            (item) => item.agent !== "NA"
          );
          setAgentspipeline(filteredResponse);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (uuid) {
      getMemory(uuid)
        .then((response) => {
          const filteredResponse = response.subtasks.filter(
            (item) => item.agent !== "NA"
          );
          setAgentspipeline(filteredResponse);
        })
        .catch((err) => console.log(err));
    }
    fetchAgents();
  }, []);

  const showAlert = (agent, message) => {
    setAgentspipeline((prevPipeline) =>
      prevPipeline.map((task) =>
        task.agent === agent ? { ...task, alert: message } : task
      )
    );

    const timeoutId = setTimeout(() => {
      hideAlert(agent);
    }, 5000);
    setAlertTimeouts((prevTimeouts) => ({
      ...prevTimeouts,
      [agent]: timeoutId,
    }));
  };

  const hideAlert = (agent) => {
    setAgentspipeline((prevPipeline) =>
      prevPipeline.map((task) =>
        task.agent === agent ? { ...task, alert: null } : task
      )
    );

    if (alertTimeouts[agent]) {
      clearTimeout(alertTimeouts[agent]);
      setAlertTimeouts((prevTimeouts) => {
        const { [agent]: _, ...rest } = prevTimeouts;
        return rest;
      });
    }
  };

  const handleEditClick = (task, index) => {
    if (task) {
      console.log("task", task);
      setCurrentTask(task);
      setCurrentTaskIndex(index);
      setIsModalOpen(true);
    } else {
      console.error("Task is null or undefined");
    }
  };
  const handleSave = (editedTask) => {
    const updatedPipeline = [...agentspipeline];
    updatedPipeline[currentTaskIndex] = editedTask;
    setAgentspipeline(updatedPipeline);
    setIsModalOpen(false);
    setCurrentTask(null);
    setCurrentTaskIndex(null);
  };

  const handleDelete = (taskToDelete) => {
    const updatedPipeline = agentspipeline.filter(
      (task) => task !== taskToDelete
    );
    setAgentspipeline(updatedPipeline);
    const updatedResponses = { ...responses };
    delete updatedResponses[taskToDelete.agent];
    setResponses(updatedResponses);

    const updatedDropdownOpen = { ...dropdownOpen };
    delete updatedDropdownOpen[taskToDelete.agent];
    setDropdownOpen(updatedDropdownOpen);
  };

  const handleAddAgent = (agent) => {
    setAgentspipeline((prev) => [...prev, { agent: agent.id, task: "" }]);
  };

  const isAgentInEditor = (agentId) => {
    return agentspipeline.some((item) => item.agent === agentId);
  };
  const handlePlayClick = async (task, index) => {
    const agentDetails = agents.find((agent) => agent.id === task.agent);
    const saveMemory = agentDetails ? agentDetails.save_memory : "N";
    if (!task.task) {
      showAlert(task.agent, "Subtask is missing!");
      return;
    }
    const uuid = sessionStorage.getItem("uuid");
    if (!uuid) {
      const uuid = uuidv4();
      sessionStorage.setItem("uuid", uuid);
    }
    const requestData = {
      uuid: sessionStorage.getItem("uuid"),
      data: {
        agent: task.agent,
        task: task.task,
      },
      previous_response: previousResponse,
      save_memory: saveMemory,
    };
    try {
      const response = await fetch(agentORCURL + "agentexecute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Check if response is a string or object and handle accordingly
      const formattedResponse =
        typeof data.response === "object" && data.response !== null
          ? {
              input: data.response.input,
              output: data.response.output,
            }
          : data.response; // if it's a string

      // Set previous response for the next call
      await setPreviousResponse(formattedResponse);

      // Update state with the agent's response
      setResponses((prevResponses) => ({
        ...prevResponses,
        [task.agent]: formattedResponse,
      }));
    } catch (error) {
      console.error("Error during the API call:", error);
    }
  };
  const handleSubmit = async () => {
    const agentWithMissingTask = agentspipeline.find((agent) => !agent.task);

    if (agentWithMissingTask) {
      showAlert(agentWithMissingTask.agent, "Subtask is missing!");
      return;
    }
    const uuid = sessionStorage.getItem("uuid");
    if (!uuid) {
      const uuid = uuidv4();
      sessionStorage.setItem("uuid", uuid);
    }
    const requestData = {
      uuid: sessionStorage.getItem("uuid"),
      data: agentspipeline,
    };

    try {
      const response = await fetch(agentORCURL + "execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response from API:", data);

      localStorage.setItem("agentResponse", JSON.stringify(data));
      localStorage.setItem("uuid", sessionStorage.getItem("uuid"));
      router.push("/show-output");
    } catch (error) {
      console.error("Error during the API call:", error);
    }
  };
  const handleCreateAgent = async (newAgent) => {
    console.log(JSON.stringify(newAgent));
    try {
      const response = await fetch(agentORCURL + "add-agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAgent),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      window.location.reload();

      console.log("Response from API:", data);
    } catch (error) {
      console.error("Error during the API call:", error);
    }
    setShowCreateModal(false);
  };
  return (
    <div className="flex h-screen">
      {sidebarOpen && (
        <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto relative custom-scrollbar">
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute top-4 right-2 text-gray-600 hover:text-gray-800"
          >
            <Icon path={mdiChevronLeftCircle} size={1.2} />
          </button>
          <h2 className="text-lg  mb-2">All Agents</h2>
          <div className="grid grid-cols-1 gap-2">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="relative bg-gradient-to-r from-gray-100 to-white p-4 shadow-lg rounded-lg cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out flex flex-col justify-center"
                onClick={() => setSelectedAgent(agent)}
              >
                <h3 className="text-xs font-semibold text-gray-800 truncate">
                  {agent.role}
                </h3>
                <p className="text-xs text-gray-600 mt-1 truncate-2-lines">
                  {agent.description}
                </p>
                {!isAgentInEditor(agent.id) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddAgent(agent);
                    }}
                    className="absolute right-[-12px] top-1/4 transform -translate-y-1/2 -translate-x-1/2 text-gray-800 hover:text-green-400"
                    style={{ zIndex: 1 }}
                  >
                    <Icon path={mdiPlus} size={1} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        className={`flex-1 bg-white p-4 transition-all duration-300  ${
          sidebarOpen ? "w-3/4" : "w-full"
        } custom-scrollbar overflow-y-auto`}
      >
        <button
          onClick={() => setSidebarOpen(true)}
          className={`absolute top-10 left-2 text-gray-600 hover:text-gray-800 ${
            sidebarOpen ? "hidden" : "block"
          }`}
        >
          <Icon path={mdiChevronRightCircle} size={1.2} />
        </button>
        <div className="flex justify-between items-center mb-4 ">
          <h2 className="text-lg font-medium">AgentORC Editor</h2>
          <button
            className="text-white p-3 rounded-full bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl"
            onClick={() => setShowCreateModal(true)}
          >
            Create New Agent
          </button>
        </div>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <div
                className="space-y-4 "
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {agentspipeline.map((item, index) => (
                  <Draggable
                    key={item.agent}
                    draggableId={item.agent}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 p-4 rounded-md shadow-md"
                      >
                        <div className="relative">
                          {item.alert && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                              <span className="block sm:inline">
                                {item.alert}
                              </span>
                            </div>
                          )}

                          <div className="flex justify-between items-center mb-2">
                            <h3 className="text-sm font-semibold text-gray-800 truncate">
                              {item.agent}
                            </h3>
                            <div className="flex justify-end space-x-2 mt-4">
                              <button
                                onClick={() => handlePlayClick(item, index)}
                                className="bg-gradient-to-r from-[#32a852] to-[#28b463] text-white px-2 py-1 rounded-full shadow-lg hover:bg-gradient-to-r hover:from-[#28b463] hover:to-[#32a852] transition-all duration-300 hover:animate-wiggle"
                              >
                                <Icon path={mdiPlay} size={1} />
                              </button>
                              <button
                                onClick={() => handleEditClick(item, index)}
                                className="bg-gradient-to-r from-[#8f2cff] to-[#3d27c5] text-white px-2 py-1 rounded-full shadow-lg hover:bg-gradient-to-r hover:from-[#3d27c5] hover:to-[#8f2cff] transition-all duration-300 hover:animate-wiggle"
                              >
                                <Icon path={mdiPencil} size={1} />
                              </button>
                              <button
                                onClick={() => handleDelete(item)}
                                className="bg-[#ff0158] text-white px-2 py-1 rounded-full shadow hover:bg-[#e6004c] hover:animate-wiggle"
                              >
                                <Icon path={mdiDelete} size={1} />
                              </button>
                              {responses[item.agent] && (
                                <button
                                  onClick={() => toggleDropdown(item.agent)}
                                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-300"
                                >
                                  <span className="text-sm font-semibold">
                                    {dropdownOpen[item.agent]
                                      ? "Hide Response"
                                      : "Show Response"}
                                  </span>
                                  <Icon
                                    path={
                                      dropdownOpen[item.agent]
                                        ? mdiChevronUp
                                        : mdiChevronDown
                                    }
                                    size={1}
                                    className="text-gray-600 hover:text-gray-800 transition-colors duration-300"
                                  />
                                </button>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 mt-2 overflow-hidden">
                            {item.task}
                          </p>
                          {dropdownOpen[item.agent] &&
                            responses[item.agent] && (
                              <div className="mt-2 w-full bg-white p-4 rounded-md shadow-inner">
                                <p className="text-gray-700">
                                  {typeof responses[item.agent] === "object" ? (
                                    <>
                                      <strong>Input:</strong>{" "}
                                      {responses[item.agent].input} <br />
                                      <strong>Output:</strong>{" "}
                                      {responses[item.agent].output}
                                    </>
                                  ) : (
                                    responses[item.agent]
                                  )}
                                </p>
                              </div>
                            )}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      <button
        onClick={handleSubmit}
        className="fixed bottom-4 right-4 text-white hover:bg-sky-700 p-3 rounded-full bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl"
      >
        Submit
      </button>
      {isModalOpen && currentTask && (
        <EditTaskForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          task={currentTask}
          onSave={handleSave}
        />
      )}
      {showCreateModal && (
        <AgentFormModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateAgent}
        />
      )}
      {selectedAgent && (
        <AgentModal
          agent={selectedAgent}
          onClose={() => setSelectedAgent(null)}
        />
      )}
    </div>
  );
};

export default Editor;
