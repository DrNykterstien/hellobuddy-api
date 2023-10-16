import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import ApiError from './api-error';

async function InputValidator(schema: any, input: any, stripUnknown = true) {
  const obj = plainToInstance(schema, input, { enableImplicitConversion: true });
  const errors = await validate(obj, { whitelist: stripUnknown });
  if (errors.length > 0) {
    const msg = errors
      .map(e => {
        const eMsg = Object.values(e.constraints as object)[0];
        return `${e.property}:${eMsg}`;
      })
      .join(',');
    throw new ApiError(422, msg);
  } else return obj;
}

export default InputValidator;
