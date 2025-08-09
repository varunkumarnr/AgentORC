import axios from "axios";
import { agentORCURL } from "../config/URLConstants";

export const getTasks = async (data) => {
  try {
    let res = await axios.post(agentORCURL + "task", data);
    console.log(res.data);
    return res.data;
  } catch (error) {
    return [];
  }
};
