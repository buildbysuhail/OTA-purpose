import { initialBankPoseData } from "../pages/settings/Administration/administration-types";
import Urls from "../redux/urls";
import { ApiEndpoint } from "./types";

export const POST_ENDPOINTS: ApiEndpoint[] = [
  // Urls.updateLanguage,
  // Urls.updateUserThemes,
  // Urls.updateLanguage,

  
  { url: Urls.BankPosSettings, initialData: initialBankPoseData },
]