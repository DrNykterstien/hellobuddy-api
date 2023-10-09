import _ from 'lodash';

interface Status {
  statusCode: number;
  message: string;
}

interface Statuses {
  [code: number]: Status;
}

const statuses: Statuses = {
  600: {
    statusCode: 409,
    message: 'Email already exists'
  },
  601: {
    statusCode: 401,
    message: 'Incorrect email or password'
  },
  602: {
    statusCode: 400,
    message: 'Wrong password'
  }
};

export default statuses;
