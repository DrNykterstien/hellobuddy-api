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
  },
  603: {
    statusCode: 404,
    message: 'User does not exist'
  },
  610: {
    statusCode: 404,
    message: 'chat does not exist'
  },
  611: {
    statusCode: 403,
    message: 'You are not chat admin'
  },
  612: {
    statusCode: 400,
    message: 'Can not remove yourself as the solo admin'
  },
  613: {
    statusCode: 400,
    message: 'Participant does not exist'
  }
};

export default statuses;
