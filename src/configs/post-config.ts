import { initialDataUser } from "../pages/settings/userManagement/user-manage-types";
import Urls from "../redux/urls";
import { ApiEndpoint } from "./types";

export const POST_ENDPOINTS: ApiEndpoint[] = [
  // Urls.updateLanguage,
  // Urls.updateUserThemes,
  // Urls.updateLanguage,
  { url: Urls.deleteInactiveTransactions, initialData: initialDataUser},
]