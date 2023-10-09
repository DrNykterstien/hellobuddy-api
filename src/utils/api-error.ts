import statuses from '../constants/api-statuses';

class ApiError extends Error {
  code: number;
  constructor(code = 500, message = 'Internal server error') {
    super(message);
    if (code >= 600 && statuses[code] === undefined) code = 500;
    this.code = code;
  }
}

export default ApiError;
