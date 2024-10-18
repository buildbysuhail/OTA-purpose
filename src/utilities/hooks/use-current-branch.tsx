import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "./useAppDispatch";
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
  return ActiveBranch;
};

export default useCurrentBranch;
