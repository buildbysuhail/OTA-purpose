import { UserAction } from "../../../helpers/user-right-helper";
import { ApplicationSettingsType } from "../../../pages/settings/system/application-settings-types/application-settings-types";
import { ClientSessionModel } from "../../../redux/slices/client-session/reducer";

export const getFilteredSettings = (
  st: any,
  clientSession: ClientSessionModel,
  applicationSettings: ApplicationSettingsType,
  hasRight: (formCode: string, action: UserAction) => boolean
) => {
  if (clientSession.isAppGlobal) {
   const excluded = [
      "void_report", // just for test
    ];

    st = st
      .filter((parent: any) => !excluded.includes(parent.title))
      .map((parent: any) => {
        const filteredChildren = parent.children?.filter(
          (child: any) =>
            !excluded.includes(child.title) &&
            hasRight(child.formCode, UserAction.Show)
        );
        return {
          ...parent,
          children: filteredChildren,
        };
      })
      .filter((parent: any) => parent.children?.length > 0);

    return st;
  } else {
    const excluded = [
      "void_report", // just for test
    ];

    st = st
      .filter((parent: any) => !excluded.includes(parent.title))
      .map((parent: any) => {
        const filteredChildren = parent.children?.filter(
          (child: any) =>
            !excluded.includes(child.title) &&
            hasRight(child.formCode, UserAction.Show)
        );
        return {
          ...parent,
          children: filteredChildren,
        };
      })
      .filter((parent: any) => parent.children?.length > 0);

    return st;
  }
};
