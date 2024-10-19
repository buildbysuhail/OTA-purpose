import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";


const useCurrentBranch = () => {
  const userSession =  useSelector((state: RootState) => (state.UserSession));
  const ActiveBranch = {
    ...userSession.branches.find(x => x.id == userSession.currentBranchId && x.clientId == userSession.currentClientId),
    address: userSession.currentBranchAddress,
    company: {
      name: userSession.currentClientName,
    }
  }  
  console.log(ActiveBranch);
  
  return ActiveBranch;
};

export default useCurrentBranch;
