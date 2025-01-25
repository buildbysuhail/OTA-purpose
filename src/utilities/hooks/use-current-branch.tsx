import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";


const useCurrentBranch = () => {
  const userBranches =  useSelector((state: RootState) => (state.UserBranches));
  const userSession =  useSelector((state: RootState) => (state.UserSession));
  const ActiveBranch = {
    ...userBranches.branches.find(x => x.id == userSession.currentBranchId && x.clientId == userSession.currentClientId),
    address: userSession.currentBranchAddress,
    company: {
      name: userSession.currentClientName,
    }
  }  
  
  return ActiveBranch;
};

export default useCurrentBranch;
