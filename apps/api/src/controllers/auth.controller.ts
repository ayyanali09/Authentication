import bcrypt from "bcryptjs";
import { isLocalDatabase } from "../config/db.js";
import { UserModel } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError, sendSuccess } from "../utils/http.js";
import { findLocalUserByEmail, findLocalUserById } from "../utils/localStore.js";
import { signToken } from "../utils/token.js";

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body as { email: string; password: string };

  if (isLocalDatabase()) {
    const user = await findLocalUserByEmail(email);

    if (!user) {
      throw new HttpError(401, "Invalid email or password");
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      throw new HttpError(401, "Invalid email or password");
    }

    const token = signToken({
      sub: user.id,
      email: user.email,
      role: user.role
    });

    return sendSuccess(res, {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  }

  const user = await UserModel.findOne({ email }).select("+passwordHash");

  if (!user) {
    throw new HttpError(401, "Invalid email or password");
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);

  if (!isValid) {
    throw new HttpError(401, "Invalid email or password");
  }

  const token = signToken({
    sub: user.id,
    email: user.email,
    role: user.role
  });

  return sendSuccess(res, {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

export const me = asyncHandler(async (req, res) => {
  if (isLocalDatabase()) {
    const user = await findLocalUserById(req.user?.id ?? "");

    if (!user) {
      throw new HttpError(404, "User not found");
    }

    return sendSuccess(res, {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  }

  const user = await UserModel.findById(req.user?.id).select("name email role").lean();

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  return sendSuccess(res, user);
});
