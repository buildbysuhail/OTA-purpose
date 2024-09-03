export interface ApiState<T = any> {
  data: T | null;
  loading: boolean;
  error: string | null;
}
export interface ApiStateWithValidation<T,V> {
  data: T | null;
  validations: V | null;
  loading: boolean;
  error: string | null;
}
export interface PaymentTerm {
  // Define the structure of a payment term
}

export interface CrudConfigType {
  [key: string]: {
    endpointUrl: string;
  };
}

export enum Actions {
  GET_USER_PROFILE = 'GET_USER_PROFILE',
  // Add other action types here
}

export enum ActionType {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  PUT = 'PUT',
  DELETE = 'DELETE'
}