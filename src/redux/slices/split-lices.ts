import { ActionType, CrudConfigType } from '../types';
import { createApiSlice, reducerNameFromUrl } from '../utils';

export const CreateSplitModuleSlices = (CrudConfig: CrudConfigType) => {
  return Object.keys(CrudConfig).reduce((acc: any, key: string) => {
    const url = CrudConfig[key].endpointUrl;
    debugger;
    const methods = ['GET', 'POST', 'PATCH', 'DELETE'];

    methods.forEach((_method) => {
      let method = _method as ActionType;
      const reducerName = reducerNameFromUrl(url, method);
      // also can pass initial vale , set it in config
      acc[reducerName] = createApiSlice(reducerName, url, method);

      if (method === 'GET') {
        const detailReducerName = reducerNameFromUrl(url, method, true);
        acc[detailReducerName] = createApiSlice(detailReducerName, `${url}/:id`, method);
      }
    });
    return acc;
  }, {});
};