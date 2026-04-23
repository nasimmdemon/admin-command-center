import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const build_target = process.argv[2] ?? "prod";
const candidate_env_file_paths = [
  path.resolve(process.cwd(), "env.local"),
  path.resolve(process.cwd(), ".env.local"),
];
const env_file_path =
  candidate_env_file_paths.find((p) => fs.existsSync(p)) ?? null;

function parse_env_file(raw_text) {
  const parsed_env = {};

  for (const line of raw_text.split(/\r?\n/)) {
    const trimmed_line = line.trim();

    if (!trimmed_line || trimmed_line.startsWith("#")) {
      continue;
    }

    const equals_index = trimmed_line.indexOf("=");

    if (equals_index === -1) {
      continue;
    }

    const key = trimmed_line.slice(0, equals_index).trim();
    let value = trimmed_line.slice(equals_index + 1).trim();

    if (!key) {
      continue;
    }

    if (
      (value.startsWith("\"") && value.endsWith("\"")) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    parsed_env[key] = value;
  }

  return parsed_env;
}

function get_required_value(vite_env, key) {
  const value = vite_env[key]?.trim();

  if (!value) {
    throw new Error(`Missing required env var: ${key}`);
  }

  return value;
}

function print_build_configuration(target, admin_api_base_url, whatsapp_api_base_url) {
  console.log(`[build_with_env_local] target=${target}`);
  console.log(
    `[build_with_env_local] VITE_ADMIN_${target === "prod" ? "PROD_" : ""}API_BASE_URL=${admin_api_base_url}`
  );
  console.log(
    `[build_with_env_local] VITE_WHATSAPP_API_${target === "prod" ? "" : "LOCAL_"}BASE_URL=${whatsapp_api_base_url}`
  );
}

const parsed_env = env_file_path
  ? parse_env_file(fs.readFileSync(env_file_path, "utf8"))
  : {};
const vite_env = { ...process.env, ...parsed_env };

if (!env_file_path) {
  console.warn(
    "[build_with_env_local] No env.local/.env.local found; relying on process.env."
  );
}

if (build_target === "prod") {
  const admin_prod_base_url = get_required_value(
    vite_env,
    "VITE_ADMIN_PROD_API_BASE_URL"
  );
  const whatsapp_prod_base_url = get_required_value(
    vite_env,
    "VITE_WHATSAPP_API_BASE_URL"
  );

  vite_env.VITE_ADMIN_PROD_API_BASE_URL = admin_prod_base_url;
  vite_env.VITE_WHATSAPP_API_BASE_URL = whatsapp_prod_base_url;

  print_build_configuration(
    build_target,
    admin_prod_base_url,
    whatsapp_prod_base_url
  );
} else if (build_target === "local") {
  const admin_local_base_url = get_required_value(
    vite_env,
    "VITE_ADMIN_API_BASE_URL"
  );
  const whatsapp_local_base_url = get_required_value(
    vite_env,
    "VITE_WHATSAPP_API_LOCAL_BASE_URL"
  );

  vite_env.VITE_ADMIN_API_BASE_URL = admin_local_base_url;
  vite_env.VITE_WHATSAPP_API_LOCAL_BASE_URL = whatsapp_local_base_url;
  vite_env.VITE_ADMIN_PROD_API_BASE_URL = admin_local_base_url;
  vite_env.VITE_WHATSAPP_API_BASE_URL = whatsapp_local_base_url;

  print_build_configuration(
    build_target,
    admin_local_base_url,
    whatsapp_local_base_url
  );
} else {
  console.error(`Unsupported build target: ${build_target}`);
  process.exit(1);
}

const vite_binary_path = path.resolve(
  process.cwd(),
  "node_modules",
  ".bin",
  process.platform === "win32" ? "vite.cmd" : "vite"
);

if (!fs.existsSync(vite_binary_path)) {
  console.error("Missing local Vite binary. Run `npm install` before building.");
  process.exit(1);
}

const result = spawnSync(vite_binary_path, ["build"], {
  cwd: process.cwd(),
  env: vite_env,
  stdio: "inherit",
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
