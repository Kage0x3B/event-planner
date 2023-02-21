import * as yup from 'yup';

export const createEventSchema = yup.object({
  name: yup.string().required(),
  tableAmount: yup.number().min(1).required(),
  tableSeatAmount: yup.number().min(1).required(),
  seatingType: yup.string().oneOf(['oneSided', 'bothSides']).required(),
  beginDate: yup.date().min(new Date()).required()
});

export const createGuestSchema = yup.object({
  eventId: yup.number().positive().required(),
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  isChild: yup.boolean().required()
});

export const updateInvitationStatusSchema = yup.object({
  id: yup.number().positive().required(),
  invitationStatus: yup.string().oneOf(['unknown', 'invited', 'confirmed', 'declined']).required()
});
