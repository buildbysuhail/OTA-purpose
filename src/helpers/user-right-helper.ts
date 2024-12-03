import { UserTypeRights } from "../redux/slices/user-rights/reducer";
import { UserModel } from "../redux/slices/user-session/reducer";
import { RootState } from "../redux/store";
import { useAppSelector } from "../utilities/hooks/useAppDispatch";
export enum UserAction {
  Add = "A",
  Edit = "E",
  Delete = "D",
  Blocked = "B",
  BlockedDiscount = "B",
  Export = "X",
  Print = "P",
}
export const useUserRights = () => {
  const hasShowRight = async (
    formCode: string,
    action: UserAction
  ): Promise<boolean> => {
    let result = false;

    const userSession = useAppSelector((state: RootState) => state.UserSession);
    const userRights = useAppSelector((state: RootState) => state.UserRights);
    const userTypeCode = userSession.userTypeCode;
    const branchId = userSession.currentBranchId;
    const userId = userSession.userId;

    if (userTypeCode === "BA" || userTypeCode === "CA") {
      return true;
    }

    try {
      let dtUserRights: UserTypeRights[] = userRights;

      if (dtUserRights.length > 0) {
        // Filter dtUserRights for matching FormCode
        const filteredRows = dtUserRights.filter(
          (row: any) => row.formCode === formCode
        );

        if (
          filteredRows.length > 0 &&
          filteredRows[0]?.userRights?.includes("S")
        ) {
          result = true;
        }
      }
    } catch (error) {
      console.error("Error checking user rights:", error);
    }

    return result;
  };
  return { hasShowRight };
};
