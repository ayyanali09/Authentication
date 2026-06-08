import type { ContactPayload } from "@vantanova/shared";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL?.trim() || "/api/v1").replace(/\/$/, "");

export type ContactStatus = "new" | "read" | "archived";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor";
};

export type ContactMessage = {
  id?: string;
  _id?: string;
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

export type FinanceEntryType = "income" | "expense";
export type FinanceEntryStatus = "paid" | "pending" | "overdue";

export type FinanceEntry = {
  id?: string;
  _id?: string;
  date: string;
  type: FinanceEntryType;
  category: string;
  description: string;
  client?: string;
  amount: number;
  paymentMethod?: string;
  status: FinanceEntryStatus;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type FinanceEntryPayload = {
  date: string;
  type: FinanceEntryType;
  category: string;
  description: string;
  client?: string;
  amount: number;
  paymentMethod?: string;
  status: FinanceEntryStatus;
  notes?: string;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  errors?: Array<{ path: string; message: string }>;
};

type RequestOptions = RequestInit & {
  token?: string | null;
};

export async function apiFetch<T>(path: string, options: RequestOptions = {}) {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  let response: Response;

  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
      cache: "no-store"
    });
  } catch {
    throw new Error("Could not connect to the server. Please try again shortly.");
  }

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? ((await response.json()) as ApiResponse<T>)
    : ({
        success: false,
        message: response.ok ? "Invalid server response" : `Server error (${response.status})`,
        data: null as T
      } satisfies ApiResponse<T>);

  if (!response.ok || !payload.success) {
    const detail = payload.errors?.map((error) => error.message).join(", ");
    throw new Error(detail || payload.message || "Request failed");
  }

  return payload.data;
}

export async function submitContact(payload: ContactPayload) {
  const endpoint = "/api/v1/contact";

  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  headers.set("Accept", "application/json");
  headers.set("X-Requested-With", "XMLHttpRequest");

  console.log("📤 Submitting contact form to:", endpoint);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      cache: "no-store",
      credentials: "omit"
    });

    console.log("📥 Backend response status:", response.status);

    const contentType = response.headers.get("content-type") ?? "";
    let apiResponse: ApiResponse<{ id: string; status: string }>;

    if (contentType.includes("application/json")) {
      try {
        apiResponse = await response.json();
      } catch (parseError) {
        console.error("Failed to parse JSON response:", parseError);
        throw new Error(`Invalid JSON response from server (${response.status})`);
      }
    } else {
      console.error("Non-JSON response from backend:", contentType);
      apiResponse = {
        success: false,
        message: response.ok ? "Invalid server response format" : `Server error (${response.status})`,
        data: null as any,
        errors: []
      };
    }

    if (!response.ok) {
      console.error("Backend error response:", apiResponse);
      const detail = apiResponse.errors?.map((error) => error.message).join(", ");
      throw new Error(detail || apiResponse.message || `Server error (${response.status})`);
    }

    if (!apiResponse.success) {
      console.error("Backend returned success:false:", apiResponse);
      throw new Error(apiResponse.message || "Server returned an error");
    }

    console.log("✅ Contact submitted successfully:", apiResponse.data);
    return apiResponse.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Contact submission failed:", errorMessage);
    throw new Error(
      errorMessage.includes("fetch") || errorMessage.includes("network")
        ? "Could not connect to the server. Please check your connection and try again."
        : errorMessage
    );
  }
}

export function loginAdmin(payload: { email: string; password: string }) {
  return apiFetch<{ token: string; user: AdminUser }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function fetchCurrentAdmin(token: string) {
  return apiFetch<AdminUser>("/auth/me", { token });
}

export function listContactMessages(token: string) {
  return apiFetch<ContactMessage[]>("/contact", { token });
}

export function updateContactMessageStatus(
  id: string,
  status: ContactStatus,
  token: string
) {
  return apiFetch<ContactMessage>(`/contact/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify({ status })
  });
}

export function deleteContactMessage(id: string, token: string) {
  return apiFetch<{ id: string }>(`/contact/${id}`, {
    method: "DELETE",
    token
  });
}

export function listFinanceEntries(token: string) {
  return apiFetch<FinanceEntry[]>("/finance", { token });
}

export function createFinanceEntry(payload: FinanceEntryPayload, token: string) {
  return apiFetch<FinanceEntry>("/finance", {
    method: "POST",
    token,
    body: JSON.stringify(payload)
  });
}

export function updateFinanceEntry(
  id: string,
  payload: FinanceEntryPayload,
  token: string
) {
  return apiFetch<FinanceEntry>(`/finance/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload)
  });
}

export function deleteFinanceEntry(id: string, token: string) {
  return apiFetch<{ id: string }>(`/finance/${id}`, {
    method: "DELETE",
    token
  });
}
