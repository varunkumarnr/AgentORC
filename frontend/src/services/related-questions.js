import axios from "axios";
import { agentORCURL } from "../config/URLConstants";

export const fetchQuestions = async (data) => {
  try {
    let res = await axios.post(agentORCURL + "related-questions", data);
    console.log(res.data);
    return res.data;
  } catch (error) {
    return [];
  }
};
