import { APIClient } from "../helpers/api-client";


const api = new APIClient();
const agentApis = {
  getAvailableAgentsForSelect: async () => {
    try {
      const responseData = await api.get('/api/Masters/Agent/GetAvailableAgentsForSelect');
      return responseData;
    } catch (error) {
      console.error("Failed to get available agents for select:", error);
      return [];
    }
  },
};

export default agentApis;
