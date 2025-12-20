import { UserAction } from "../../../helpers/user-right-helper";
import { ApplicationSettingsType } from "../../../pages/settings/system/application-settings-types/application-settings-types";
import { ClientSessionModel } from "../../../redux/slices/client-session/reducer";

export const getFilteredMenu = (
  st: any,
  clientSession: ClientSessionModel,
  applicationSettings: ApplicationSettingsType,
  hasRight: (formCode: string, action: UserAction) => boolean
) => {
    st = st
      .map((parent: any) => {
        const filteredChildren = parent.children?.filter(
          (child: any) =>
            hasRight(child.formCode, UserAction.Show)
        );
        return {
          ...parent,
          children: filteredChildren,
        };
      })
      .filter((parent: any) => parent.children?.length > 0);

    return st;
};
