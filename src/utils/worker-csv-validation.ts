/**
 * CSV worker upload validation.
 * Mirrors BLAPI CreationFromCSV logic: headers, required fields, brand/department, duplicates.
 */

export const REQUIRED_HEADERS = [
  "full_name",
  "brand name",
  "department name",
  "desks",
  "email",
  "password",
  "title",
  "is_manager",
  "client_data_prem",
  "phone_number",
] as const;

export type WorkerCsvHeader = (typeof REQUIRED_HEADERS)[number];

export const DEPARTMENTS = ["QA", "CO", "RE", "IT"] as const;
export type DepartmentId = (typeof DEPARTMENTS)[number];

export const CLIENT_DATA_PREM_VALUES = ["View", "Add", "Edit"] as const;

export interface WorkerRow {
  rowIndex: number;
  full_name: string;
  brandName: string;
  departmentName: string;
  desks: string;
  email: string;
  password: string;
  title: string;
  is_manager: string;
  client_data_prem: string;
  phone_number: string;
  raw: Record<string, string>;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidatedRow {
  row: WorkerRow;
  valid: boolean;
  errors: ValidationError[];
}

/** Normalize header: trim, lowercase for matching */
function normalizeHeader(h: string): string {
  return h.trim().toLowerCase();
}

/** Parse CSV text into rows with headers */
export function parseCsv(text: string): { headers: string[]; rows: Record<string, string>[] } {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return { headers: [], rows: [] };
  const headers = lines[0].split(",").map((h) => h.trim());
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx]?.trim() ?? "";
    });
    rows.push(row);
  }
  return { headers, rows };
}

/** Parse a single CSV line handling quoted values */
function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQuotes = !inQuotes;
    } else if (c === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += c;
    }
  }
  result.push(current);
  return result;
}

/** Map raw row to WorkerRow using header aliases */
function mapToWorkerRow(raw: Record<string, string>, rowIndex: number): WorkerRow {
  const get = (keys: string[]) => {
    for (const k of keys) {
      const v = raw[k] ?? raw[k.trim()];
      if (v !== undefined) return String(v).trim();
    }
    return "";
  };
  return {
    rowIndex,
    full_name: get(["full_name", "full name"]),
    brandName: get(["brand name", "brand_name", "brandname"]),
    departmentName: get(["department name", "department_name", "department"]),
    desks: get(["desks", "desk"]),
    email: get(["email"]),
    password: get(["password"]),
    title: get(["title"]),
    is_manager: get(["is_manager", "is manager"]),
    client_data_prem: get(["client_data_prem", "client data prem"]),
    phone_number: get(["phone_number", "phone number", "phone"]),
    raw,
  };
}

const HEADER_ALIASES: Record<string, string[]> = {
  full_name: ["full_name", "full name"],
  brandName: ["brand name", "brand_name", "brandname"],
  departmentName: ["department name", "department_name", "department"],
  desks: ["desks", "desk"],
  email: ["email"],
  password: ["password"],
  title: ["title"],
  is_manager: ["is_manager", "is manager"],
  client_data_prem: ["client_data_prem", "client data prem"],
  phone_number: ["phone_number", "phone number", "phone"],
};

/** Check required headers exist (case-insensitive) */
export function checkHeaders(headers: string[]): ValidationError[] {
  const normalized = new Set(headers.map((h) => normalizeHeader(h)));
  const errors: ValidationError[] = [];
  for (const [field, aliases] of Object.entries(HEADER_ALIASES)) {
    const found = aliases.some((a) => normalized.has(normalizeHeader(a)));
    if (!found) {
      errors.push({ field: "headers", message: `Missing required column: ${aliases[0]}` });
    }
  }
  return errors;
}

/** Validate a single row */
export function validateRow(
  row: WorkerRow,
  options: {
    allowedBrands: string[];
    duplicateEmails: Set<string>;
  }
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!row.full_name?.trim()) errors.push({ field: "full_name", message: "Full name is required" });
  if (!row.brandName?.trim()) errors.push({ field: "brand name", message: "Brand name is required" });
  if (!row.departmentName?.trim()) errors.push({ field: "department name", message: "Department is required" });
  if (!row.email?.trim()) errors.push({ field: "email", message: "Email is required" });
  if (!row.password?.trim()) errors.push({ field: "password", message: "Password is required" });
  if (!row.title?.trim()) errors.push({ field: "title", message: "Title is required" });
  if (!row.is_manager?.trim()) errors.push({ field: "is_manager", message: "is_manager is required" });
  if (!row.client_data_prem?.trim()) errors.push({ field: "client_data_prem", message: "client_data_prem is required" });
  if (!row.phone_number?.trim()) errors.push({ field: "phone_number", message: "Phone number is required" });

  const dept = row.departmentName.trim().toUpperCase();
  if (dept && !DEPARTMENTS.includes(dept as DepartmentId)) {
    errors.push({ field: "department name", message: `Department must be one of: ${DEPARTMENTS.join(", ")}` });
  }

  if (row.brandName?.trim() && options.allowedBrands.length > 0 && !options.allowedBrands.includes("*")) {
    const brandNorm = row.brandName.trim().toLowerCase();
    const match = options.allowedBrands.some((b) => b.trim().toLowerCase() === brandNorm);
    if (!match) {
      errors.push({ field: "brand name", message: `Brand "${row.brandName}" not in wizard. Allowed: ${options.allowedBrands.join(", ")}` });
    }
  }

  const needsDesk = dept === "CO" || dept === "RE";
  if (needsDesk && !row.desks?.trim()) {
    errors.push({ field: "desks", message: `Department ${dept} requires a desk (e.g. FR, US)` });
  }

  const prem = row.client_data_prem?.trim();
  if (prem && !CLIENT_DATA_PREM_VALUES.includes(prem as (typeof CLIENT_DATA_PREM_VALUES)[number])) {
    errors.push({ field: "client_data_prem", message: `Must be one of: ${CLIENT_DATA_PREM_VALUES.join(", ")}` });
  }

  const im = row.is_manager?.trim().toUpperCase();
  if (im && im !== "TRUE" && im !== "FALSE") {
    errors.push({ field: "is_manager", message: "Must be TRUE or FALSE" });
  }

  const emailNorm = row.email?.trim().toLowerCase();
  if (emailNorm) {
    const basicEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!basicEmail.test(emailNorm)) {
      errors.push({ field: "email", message: "Invalid email format" });
    }
    if (options.duplicateEmails.has(emailNorm)) {
      errors.push({ field: "email", message: "Duplicate email (used in another row)" });
    }
  }

  return errors;
}

/** Full validation: parse CSV, check headers, validate each row, detect duplicate emails */
export function validateWorkerCsv(
  text: string,
  allowedBrands: string[]
): { headerErrors: ValidationError[]; rows: ValidatedRow[] } {
  const { headers, rows } = parseCsv(text);
  const headerErrors = checkHeaders(headers);
  const validated: ValidatedRow[] = [];

  const emailCount = new Map<string, number[]>();
  for (let i = 0; i < rows.length; i++) {
    const r = mapToWorkerRow(rows[i], i + 2);
    const email = r.email?.trim().toLowerCase();
    if (email) {
      const arr = emailCount.get(email) ?? [];
      arr.push(r.rowIndex);
      emailCount.set(email, arr);
    }
  }
  const duplicateEmails = new Set<string>();
  emailCount.forEach((indices, email) => {
    if (indices.length > 1) duplicateEmails.add(email);
  });

  for (let i = 0; i < rows.length; i++) {
    const row = mapToWorkerRow(rows[i], i + 2);

    const errors =
      headerErrors.length > 0
        ? [{ field: "headers", message: "Fix missing headers first" } as ValidationError]
        : validateRow(row, {
            allowedBrands,
            duplicateEmails,
          });

    validated.push({
      row,
      valid: errors.length === 0,
      errors,
    });
  }

  return { headerErrors, rows: validated };
}
