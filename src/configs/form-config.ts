import { initialDataUser } from "../pages/settings/userManagement/user-manage-types";
import { ActionType } from "../redux/types";
import Urls from "../redux/urls";
import { ApiEndpoint } from "./types";

export const FORM_ENDPOINTS: ApiEndpoint[] = [
  { url: Urls.Users, initialData: initialDataUser },
] as const;