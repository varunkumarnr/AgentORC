import axios from "axios";
import { agentORCURL } from "../config/URLConstants";

export const getMemory = async (uuid) => {
  try {
    console.log(uuid);
    let res = await axios.get(agentORCURL + `memory/${uuid}`);
    console.log(res.data);
    return res.data;
  } catch (error) {
    return [];
  }
};
