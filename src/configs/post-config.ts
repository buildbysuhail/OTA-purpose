import { initialCompanyProfileData } from "../pages/settings/Administration/Company-Profile-manage";
import { initialDataDeleteInactive } from "../pages/settings/Administration/delete-inactive-transactions-manage";
import Urls from "../redux/urls";
import { ApiEndpoint } from "./types";

export const POST_ENDPOINTS: ApiEndpoint[] = [
  // Urls.updateLanguage,
  // Urls.updateUserThemes,
  // Urls.updateLanguage,
  { url: Urls.deleteInactiveTransactions, initialData: initialDataDeleteInactive },
  { url: Urls.CompanyProfiles, initialData: initialCompanyProfileData },
]