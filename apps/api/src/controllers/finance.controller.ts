import { isLocalDatabase } from "../config/db.js";
import { FinanceEntryModel } from "../models/FinanceEntry.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError, sendSuccess } from "../utils/http.js";
import {
  createLocalFinanceEntry,
  deleteLocalFinanceEntry,
  listLocalFinanceEntries,
  updateLocalFinanceEntry
} from "../utils/localStore.js";

export const listFinanceEntries = asyncHandler(async (_req, res) => {
  if (isLocalDatabase()) {
    const entries = await listLocalFinanceEntries();
    return sendSuccess(res, entries);
  }

  const entries = await FinanceEntryModel.find()
    .sort({ date: -1, createdAt: -1 })
    .lean();

  return sendSuccess(res, entries);
});

export const createFinanceEntry = asyncHandler(async (req, res) => {
  if (isLocalDatabase()) {
    const entry = await createLocalFinanceEntry(req.body);
    return sendSuccess(res, entry, 201, "Finance entry created");
  }

  const entry = await FinanceEntryModel.create(req.body);
  return sendSuccess(res, entry, 201, "Finance entry created");
});

export const updateFinanceEntry = asyncHandler(async (req, res) => {
  if (isLocalDatabase()) {
    const entry = await updateLocalFinanceEntry(String(req.params.id), req.body);

    if (!entry) {
      throw new HttpError(404, "Finance entry not found");
    }

    return sendSuccess(res, entry, 200, "Finance entry updated");
  }

  const entry = await FinanceEntryModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!entry) {
    throw new HttpError(404, "Finance entry not found");
  }

  return sendSuccess(res, entry, 200, "Finance entry updated");
});

export const deleteFinanceEntry = asyncHandler(async (req, res) => {
  if (isLocalDatabase()) {
    const entry = await deleteLocalFinanceEntry(String(req.params.id));

    if (!entry) {
      throw new HttpError(404, "Finance entry not found");
    }

    return sendSuccess(res, { id: req.params.id }, 200, "Finance entry deleted");
  }

  const entry = await FinanceEntryModel.findByIdAndDelete(req.params.id);

  if (!entry) {
    throw new HttpError(404, "Finance entry not found");
  }

  return sendSuccess(res, { id: req.params.id }, 200, "Finance entry deleted");
});
