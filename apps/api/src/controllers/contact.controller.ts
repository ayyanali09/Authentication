import { isLocalDatabase } from "../config/db.js";
import { ContactMessageModel } from "../models/ContactMessage.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError, sendSuccess } from "../utils/http.js";
import {
  createLocalContactMessage,
  deleteLocalContactMessage,
  listLocalContactMessages,
  updateLocalContactMessageStatus
} from "../utils/localStore.js";

export const createContactMessage = asyncHandler(async (req, res) => {
  if (isLocalDatabase()) {
    const message = await createLocalContactMessage({
      ...req.body,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"]
    });

    return sendSuccess(res, {
      id: message.id,
      status: message.status
    }, 201, "Message received");
  }

  const message = await ContactMessageModel.create({
    ...req.body,
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"]
  });

  return sendSuccess(res, {
    id: message.id,
    status: message.status
  }, 201, "Message received");
});

export const listContactMessages = asyncHandler(async (_req, res) => {
  if (isLocalDatabase()) {
    const messages = await listLocalContactMessages();
    return sendSuccess(res, messages);
  }

  const messages = await ContactMessageModel.find().sort({ createdAt: -1 }).lean();
  return sendSuccess(res, messages);
});

export const updateContactMessage = asyncHandler(async (req, res) => {
  if (isLocalDatabase()) {
    const message = await updateLocalContactMessageStatus(String(req.params.id), req.body.status);

    if (!message) {
      throw new HttpError(404, "Contact message not found");
    }

    return sendSuccess(res, message, 200, "Contact message updated");
  }

  const message = await ContactMessageModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!message) {
    throw new HttpError(404, "Contact message not found");
  }

  return sendSuccess(res, message, 200, "Contact message updated");
});

export const deleteContactMessage = asyncHandler(async (req, res) => {
  if (isLocalDatabase()) {
    const message = await deleteLocalContactMessage(String(req.params.id));

    if (!message) {
      throw new HttpError(404, "Contact message not found");
    }

    return sendSuccess(res, { id: req.params.id }, 200, "Contact message deleted");
  }

  const message = await ContactMessageModel.findByIdAndDelete(req.params.id);

  if (!message) {
    throw new HttpError(404, "Contact message not found");
  }

  return sendSuccess(res, { id: req.params.id }, 200, "Contact message deleted");
});
