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
  const userSession = useAppSelector((state: RootState) => state.UserSession);
  const userRights = useAppSelector((state: RootState) => state.UserRights);
  const hasRight = (formCode: string, action: UserAction): boolean => {
    let result = false;

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
  const getAllowedFormCodes = (
    formCodes: string[],
    action: UserAction
  ): string[] => {
    const userTypeCode = userSession.userTypeCode;

    // Automatically grant rights if userTypeCode is "BA" or "CA"
    if (userTypeCode === "BA" || userTypeCode === "CA") {
      return formCodes;
    }

    try {
      let dtUserRights: UserTypeRights[] = userRights;

      return formCodes.filter((formCode) => {
        const filteredRows = dtUserRights.filter(
          (row: any) => row.formCode === formCode
        );
        const out =
          filteredRows.length > 0 &&
          filteredRows[0]?.userRights?.includes(action);
        return out;
      });
    } catch (error) {
      console.error("Error checking user rights:", error);
      return [];
    }
  };
  return { hasRight, getAllowedFormCodes };
};
