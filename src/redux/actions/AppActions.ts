import { camelize, capitalizeFirstLetter } from "../../utilities/Utils";



type actionType = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export const reducerNameFromUrl = (url: string, method: actionType, isDetail = false) => {
  const match = /[^a-zA-Z ]/g;
  const lastPath = /\/([^/]*)$/;
  let name = `${method.toLowerCase()}${url}`.replace(lastPath, "")?.replaceAll(match, " ");
  name = capitalizeFirstLetter(camelize(name));
  if (isDetail) {
    name = name + "Detail";
  }
  return name;
};
