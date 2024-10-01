import { ActionType } from "../redux/types";
import Urls from "../redux/urls";
import { ApiEndpoint } from "./types";

export const DATA_ENDPOINTS: ApiEndpoint[] = [
  { url: Urls.data_countries, method: ActionType.GET as const, initialData: { language: 'en' } },
  { url: Urls.data_languages, method: ActionType.GET as const },
  { url: Urls.updateLanguage, method: ActionType.POST as const },
  { url: Urls.updateUserThemes, method: ActionType.POST as const },
  { url: Urls.updateLanguage, method: ActionType.POST as const },
] as const;