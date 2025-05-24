import { UserTypeRights } from "../redux/slices/user-rights/reducer";
import { UserModel } from "../redux/slices/user-session/reducer";
import { RootState } from "../redux/store";
import { getUserSessionData } from "../session-data";
import { useAppSelector } from "../utilities/hooks/useAppDispatch";
export enum UserAction {
  Add = "A",
  Edit = "E",
  Delete = "D",
  Blocked = "B",
  BlockedDiscount = "B",
  Export = "X",
  Print = "P",
  Show = "S",
}
export const useUserRights = () => {
  const _userSession = useAppSelector((state: RootState) => state.UserSession);
  const _userRights = useAppSelector((state: RootState) => state.UserRights);
  const _clientSession = useAppSelector(
    (state: RootState) => state.ClientSession
  );
  let __userSession = _userSession;
    let __userRights = _userRights;
    let __clientSession = _clientSession;

    if (__userSession.userId == 0 ||__clientSession.planFormCodes == "" || __userRights ==  undefined || __userRights.length == 0) {
      const {
        token,
        userThemes,
        clientSession,
        userProfileDetails,
        userRights,
        locale,
      } = getUserSessionData();

      __userSession = userProfileDetails;
      __userRights = userRights;
      __clientSession = clientSession;
    }

  const hasRight = (formCode: string, action: UserAction): boolean => {
    let result = false;

    

    const planRights = __clientSession.planFormCodes?.split(",");
    const userTypeCode = __userSession.userTypeCode;
    const branchId = __userSession.currentBranchId;
    const userId = __userSession.userId;

    if (userTypeCode === "BA" || userTypeCode === "CA") {
      return planRights?.includes(formCode) ?? false;
    }

    try {
      let dtUserRights: UserTypeRights[] = __userRights;

      if (dtUserRights.length > 0) {
        // Filter dtUserRights for matching FormCode
        const filteredRows = dtUserRights.filter(
          (row: any) => row.formCode === formCode
        );

        if (
          filteredRows.length > 0 &&
          filteredRows[0]?.userRights?.split("").includes("S")
        ) {
          result = true;
        }
      }
    } catch (error) {
      console.error("Error checking user rights:", error);
    }

    return result;
  };
  const hasBlockedRight = (formCode: string): boolean => {
    let result = false;

    const userTypeCode = __userSession.userTypeCode;
    const branchId = __userSession.currentBranchId;
    const userId = __userSession.userId;

    const planRights = __clientSession.planFormCodes?.split(",");

    // Return false for "BA" or "CA" user types
    if (userTypeCode === "BA" || userTypeCode === "CA") {
      return !planRights?.includes(formCode);
    }

    try {
      // Check if userRights data exists
      let dtUserRights: UserTypeRights[] = __userRights;

      if (dtUserRights.length > 0) {
        // Filter user rights for the given FormCode
        const filteredRows = dtUserRights.filter(
          (row: any) => row.formCode === formCode
        );

        if (
          filteredRows.length > 0 &&
          filteredRows[0]?.userRights?.split("").includes("B")
        ) {
          result = true;
        } else {
          result = false;
        }
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error checking blocked rights:", error);
      result = false;
    }

    return result;
  };

  const getAllowedFormCodes = (
    formCodes: string[],
    action: UserAction
  ): string[] => {
    const userTypeCode = __userSession.userTypeCode;

    const planRights = __clientSession.planFormCodes?.split(",");

    // Automatically grant rights if userTypeCode is "BA" or "CA"
    if (userTypeCode === "BA" || userTypeCode === "CA") {
      return formCodes.filter((formCode) => {
        return planRights?.includes(formCode);
      });
    }

    try {
      let dtUserRights: UserTypeRights[] = __userRights;

      return formCodes.filter((formCode) => {
        const filteredRows = dtUserRights.filter(
          (row: any) => row.formCode === formCode
        );

        return (
          filteredRows.length > 0 &&
          filteredRows[0]?.userRights?.split("").includes(action)
        );
      });
    } catch (error) {
      console.error("Error checking user rights:", error);
      return [];
    }
  };
  return { hasRight, getAllowedFormCodes, hasBlockedRight };
};
