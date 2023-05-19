import Joi from 'joi';

export const userValidationSchema = Joi.object({
  _id: Joi.string().optional(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  trips: Joi.array().items(Joi.string()).optional(),
});
