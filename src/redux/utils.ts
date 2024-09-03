import { camelize, capitalizeFirstLetter } from '../utilities/Utils';
import { APIClient } from '../helpers/api-client';
import { ActionType, ApiState } from './types';
const apiClient = new APIClient();
export const reducerNameFromUrl = (url: string, method: ActionType, isDetail = false) => {
  const match = /[^a-zA-Z ]/g;
  const lastPath = /\/([^/]*)$/;
  let name = `${method.toLowerCase()}${url}`.replace(lastPath, "")?.replaceAll(match, " ");
  name = capitalizeFirstLetter(camelize(name));
  if (isDetail) {
    name = name + "Detail";
  }
  return name;
};