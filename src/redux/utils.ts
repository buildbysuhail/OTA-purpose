import { camelize, capitalizeFirstLetter } from '../utilities/Utils';
import { APIClient } from '../helpers/api-client';
import { ActionType, ApiState } from './types';
const apiClient = new APIClient();