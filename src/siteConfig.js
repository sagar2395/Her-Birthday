/*
  ════════════════════════════════════════════════════════════════════════════
   TENANT RESOLVER  (Phase 2 — multi-tenant rendering)
   ════════════════════════════════════════════════════════════════════════════

  App.jsx is a pure renderer that imports a single `siteConfig`. This module
  decides WHICH config that is, based on the subdomain the visitor came in on:

      nidhi.ourdomain.com   → tenants/nidhi.json
      demo.ourdomain.com    → tenants/demo.json
      ourdomain.com / www   → the default tenant

  Local dev (no DNS needed): use a subdomain on localhost
      http://nidhi.localhost:5173     http://demo.localhost:5173
  …or an explicit override query param
      http://localhost:5173/?tenant=demo

  PRODUCTION NOTE: in the real multi-tenant SaaS this lookup moves SERVER-SIDE —
  middleware reads the Host header, finds the tenant row, and loads that one
  tenant's config JSON from the database/object storage (so we don't bundle
  every tenant into one file). This client-side registry is the in-Vite proof
  that the renderer is fully config-driven and isolates cleanly per subdomain.
  See product-plan/02-architecture.md → "Multi-tenancy & subdomains".
*/

import nidhi from "./tenants/nidhi.json";
import demo from "./tenants/demo.json";

// Registry of all tenants, keyed by their subdomain.
export const TENANTS = { nidhi, demo };

// The fallback when no subdomain matches (apex domain, unknown host, etc.).
export const DEFAULT_TENANT = "nidhi";

// Subdomains we never treat as a tenant (reserved for the platform itself).
const RESERVED = new Set([
  "www", "app", "api", "admin", "mail", "static", "cdn", "assets", "dashboard",
]);

/**
 * Resolve a tenant key from a hostname (+ optional ?query string).
 * Pure and side-effect-free so it can be unit-tested.
 */
export function resolveTenantKey(hostname = "", search = "") {
  // 1) explicit override — handy for local dev / previews: ?tenant=demo
  const override = new URLSearchParams(search).get("tenant");
  if (override && TENANTS[override]) return override;

  // 2) first label of the host: "nidhi.ourdomain.com" / "nidhi.localhost" → "nidhi"
  const host = (hostname || "").split(":")[0];
  const labels = host.split(".");
  if (labels.length >= 2) {
    const sub = labels[0].toLowerCase();
    if (!RESERVED.has(sub) && TENANTS[sub]) return sub;
  }

  // 3) fall back to the default tenant
  return DEFAULT_TENANT;
}

/**
 * Builder preview: when opened as `/?preview=1`, render the real app from the
 * draft config the builder stashed in localStorage (instead of a tenant). This
 * is how the Phase-3 builder shows full-fidelity previews through this same
 * renderer. Returns null when not in preview mode or no draft is present.
 */
function previewConfig() {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  if (params.get("preview") !== "1") return null;
  try {
    const raw = window.localStorage.getItem("previewConfig");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const key =
  typeof window !== "undefined"
    ? resolveTenantKey(window.location.hostname, window.location.search)
    : DEFAULT_TENANT;

export const activeTenant = key;

const siteConfig = previewConfig() || TENANTS[key] || TENANTS[DEFAULT_TENANT];
export default siteConfig;
