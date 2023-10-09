import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import ApiError from './api-error';

async function InputValidator(schema: any, input: any) {
  const obj = plainToInstance(schema, input);
  const errors = await validate(obj);
  if (errors.length > 0) {
    const msg = errors
      .map(e => {
        const eMsg = Object.values(e.constraints as object)[0];
        return `${e.property}:${eMsg}`;
      })
      .join(',');
    throw new ApiError(422, msg);
  } else return input;
}

export default InputValidator;
