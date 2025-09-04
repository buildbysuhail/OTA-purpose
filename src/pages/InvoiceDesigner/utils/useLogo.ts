// hooks/useLogo.ts
import { useEffect, useMemo } from "react";
import useCurrentBranch from "../../../utilities/hooks/use-current-branch";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useAppSelector } from "../../../utilities/hooks/useAppDispatch";



export const useLogo = (): string | undefined => {
  const currentBranch = useCurrentBranch();
  const userSession = useSelector((state: RootState) => state.UserSession);
  useEffect(()=>{
 console.log("currentBranch",currentBranch,"userSession",userSession);
 
  },[])

  const logo = useMemo(() => {
    // 1) currentBranch logo
    if (currentBranch?.logo) return currentBranch.logo;

    // 2) find in userBranches
    const fromUseSessionBranches = userSession?.branches?.find((b) => b?.id == userSession?.currentBranchId )?.logo;
    if (fromUseSessionBranches) return fromUseSessionBranches;

    // 3) try useSession.company array (if present)
    const fromUseSessionCompany = userSession?.companies?.find((c) => c?.id == userSession?.currentClientId)?.logo;
    if (fromUseSessionCompany) return fromUseSessionCompany;



    return undefined;
  }, [currentBranch, userSession]);

  return logo;
};

export default useLogo;
