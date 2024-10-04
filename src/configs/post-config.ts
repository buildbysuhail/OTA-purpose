import { initialBankPoseData } from "../pages/settings/Administration/administration-types";
import { initialBranchData } from "../pages/settings/Administration/branches-manage";
import { initialCompanyProfileData } from "../pages/settings/Administration/Company-Profile-manage";
import { initialDataDeleteInactive } from "../pages/settings/Administration/delete-inactive-transactions-manage";
import { initialResetDbData } from "../pages/settings/system/reset-database-manage";
import Urls from "../redux/urls";
import { ApiEndpoint } from "./types";

export const POST_ENDPOINTS: ApiEndpoint[] = [
  // Urls.updateLanguage,
  // Urls.updateUserThemes,
  // Urls.updateLanguage,
  { url: Urls.deleteInactiveTransactions, initialData: initialDataDeleteInactive },
  { url: Urls.CompanyProfiles, initialData: initialCompanyProfileData },
  { url: Urls.BankPosSettings, initialData: initialBankPoseData },
  { url: Urls.Branch, initialData: initialBranchData },
  { url: Urls.reset_data_base, initialData: initialResetDbData},
]