import * as Joi from 'joi';

export const portSchema = Joi.number().port().required();
