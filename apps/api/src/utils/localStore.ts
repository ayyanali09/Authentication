import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { ContactStatus } from "../models/ContactMessage.js";
import type {
  FinanceEntryStatus,
  FinanceEntryType
} from "../models/FinanceEntry.js";
import type { UserRole } from "../models/User.js";

export type LocalUser = {
  id: string;
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
};

export type LocalContactMessage = {
  id: string;
  _id: string;
  name: string;
  email: string;
  company?: string;
  service: string;
  budget?: string;
  message: string;
  status: ContactStatus;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  updatedAt: string;
};

export type LocalFinanceEntry = {
  id: string;
  _id: string;
  date: string;
  type: FinanceEntryType;
  category: string;
  description: string;
  client?: string;
  amount: number;
  paymentMethod?: string;
  status: FinanceEntryStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

type LocalData = {
  users: LocalUser[];
  contactMessages: LocalContactMessage[];
  financeEntries: LocalFinanceEntry[];
};

const dataFilePath = path.join(process.cwd(), ".local-data", "api.json");

function emptyData(): LocalData {
  return {
    users: [],
    contactMessages: [],
    financeEntries: []
  };
}

function now() {
  return new Date().toISOString();
}

function createId() {
  return randomUUID();
}

async function readData(): Promise<LocalData> {
  try {
    const raw = await readFile(dataFilePath, "utf8");
    return { ...emptyData(), ...JSON.parse(raw) };
  } catch {
    return emptyData();
  }
}

async function writeData(data: LocalData) {
  await mkdir(path.dirname(dataFilePath), { recursive: true });
  await writeFile(dataFilePath, JSON.stringify(data, null, 2));
}

async function mutateData<T>(callback: (data: LocalData) => T | Promise<T>) {
  const data = await readData();
  const result = await callback(data);
  await writeData(data);
  return result;
}

export async function ensureLocalAdmin(input: {
  name: string;
  email: string;
  passwordHash: string;
}) {
  return mutateData((data) => {
    if (data.users.length > 0) {
      return data.users[0];
    }

    const timestamp = now();
    const id = createId();
    const user: LocalUser = {
      id,
      _id: id,
      name: input.name,
      email: input.email.toLowerCase(),
      passwordHash: input.passwordHash,
      role: "admin",
      createdAt: timestamp,
      updatedAt: timestamp
    };

    data.users.push(user);
    return user;
  });
}

export async function findLocalUserByEmail(email: string) {
  const data = await readData();
  return data.users.find((user) => user.email === email.toLowerCase()) ?? null;
}

export async function findLocalUserById(id: string) {
  const data = await readData();
  return data.users.find((user) => user.id === id || user._id === id) ?? null;
}

export async function createLocalContactMessage(
  body: Omit<LocalContactMessage, "id" | "_id" | "status" | "createdAt" | "updatedAt"> & {
    status?: ContactStatus;
  }
) {
  return mutateData((data) => {
    const timestamp = now();
    const id = createId();
    const message: LocalContactMessage = {
      id,
      _id: id,
      ...body,
      status: body.status ?? "new",
      createdAt: timestamp,
      updatedAt: timestamp
    };

    data.contactMessages.unshift(message);
    return message;
  });
}

export async function listLocalContactMessages() {
  const data = await readData();
  return data.contactMessages.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function updateLocalContactMessageStatus(id: string, status: ContactStatus) {
  return mutateData((data) => {
    const message = data.contactMessages.find((item) => item.id === id || item._id === id);

    if (!message) {
      return null;
    }

    message.status = status;
    message.updatedAt = now();
    return message;
  });
}

export async function deleteLocalContactMessage(id: string) {
  return mutateData((data) => {
    const index = data.contactMessages.findIndex((item) => item.id === id || item._id === id);

    if (index === -1) {
      return null;
    }

    return data.contactMessages.splice(index, 1)[0];
  });
}

export async function listLocalFinanceEntries() {
  const data = await readData();
  return data.financeEntries.sort(
    (a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt)
  );
}

export async function createLocalFinanceEntry(
  body: Omit<LocalFinanceEntry, "id" | "_id" | "createdAt" | "updatedAt">
) {
  return mutateData((data) => {
    const timestamp = now();
    const id = createId();
    const entry: LocalFinanceEntry = {
      id,
      _id: id,
      ...body,
      date: new Date(body.date).toISOString(),
      createdAt: timestamp,
      updatedAt: timestamp
    };

    data.financeEntries.unshift(entry);
    return entry;
  });
}

export async function updateLocalFinanceEntry(
  id: string,
  body: Partial<Omit<LocalFinanceEntry, "id" | "_id" | "createdAt" | "updatedAt">>
) {
  return mutateData((data) => {
    const entry = data.financeEntries.find((item) => item.id === id || item._id === id);

    if (!entry) {
      return null;
    }

    Object.assign(entry, {
      ...body,
      date: body.date ? new Date(body.date).toISOString() : entry.date,
      updatedAt: now()
    });

    return entry;
  });
}

export async function deleteLocalFinanceEntry(id: string) {
  return mutateData((data) => {
    const index = data.financeEntries.findIndex((item) => item.id === id || item._id === id);

    if (index === -1) {
      return null;
    }

    return data.financeEntries.splice(index, 1)[0];
  });
}
