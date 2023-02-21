import * as yup from 'yup';

export const createEventSchema = yup.object({
  name: yup.string().required(),
  tableAmount: yup.number().min(1).required(),
  tableSeatAmount: yup.number().min(1).required(),
  seatingType: yup.string().oneOf(['oneSided', 'bothSides']).required(),
  beginDate: yup.date().min(new Date()).required()
});
