import axios from "axios";

export const getCapsules = async (query = "") => {
  return axios.get(`http://localhost:4500/capsules?${query}`);
};
