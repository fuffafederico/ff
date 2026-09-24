// Google Consent Mode: default state, set before any tag can load.
window.dataLayer = window.dataLayer || [];
function gtag() { window.dataLayer.push(arguments); }
window.gtag = gtag;
gtag("consent", "default", {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
  wait_for_update: 500,
});

// Set as PUBLIC_GA_MEASUREMENT_ID in Netlify's environment variables.
// Left unset, GA stays disabled.
const GA_ID = import.meta.env.PUBLIC_GA_MEASUREMENT_ID || "";
const GA_ID_VALID = /^G-[A-Z0-9]+$/i.test(GA_ID);

const STORAGE_KEY = "cookie-consent";

function readConsent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeConsent(status) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ status, ts: Date.now() }));
  } catch {
    /* storage unavailable: consent choice will be asked again next visit */
  }
}

let gaLoaded = false;
function loadGA() {
  if (!GA_ID_VALID || gaLoaded) return;
  gaLoaded = true;
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_ID);
  document.head.appendChild(s);
  gtag("js", new Date());
  gtag("config", GA_ID, { anonymize_ip: true });
}

function grantConsent() {
  gtag("consent", "update", { analytics_storage: "granted" });
  writeConsent("granted");
  loadGA();
  hideBanner();
}

function denyConsent() {
  gtag("consent", "update", { analytics_storage: "denied" });
  writeConsent("denied");
  hideBanner();
}

let banner = null;
function buildBanner() {
  if (banner) return banner;
  banner = document.createElement("div");
  banner.className = "cookie-banner";
  banner.setAttribute("role", "region");
  banner.setAttribute("aria-label", "Preferenze cookie");
  banner.innerHTML =
    '<div class="wrap">' +
      '<p>Uso Google Analytics solo con il tuo consenso, per capire come viene usato il sito. Puoi cambiare idea in qualsiasi momento dal link "Preferenze cookie" nel footer. <a href="/privacy#cookie">Maggiori informazioni</a>.</p>' +
      '<div class="cookie-actions">' +
        '<button type="button" class="btn btn-secondary" data-consent="deny">Rifiuta</button>' +
        '<button type="button" class="btn btn-primary" data-consent="accept">Accetta</button>' +
      "</div>" +
    "</div>";
  document.body.appendChild(banner);
  banner.querySelector('[data-consent="accept"]').addEventListener("click", grantConsent);
  banner.querySelector('[data-consent="deny"]').addEventListener("click", denyConsent);
  return banner;
}

function showBanner() {
  buildBanner().style.display = "block";
}

function hideBanner() {
  if (banner) banner.style.display = "none";
}

function initConsent() {
  const stored = readConsent();
  if (stored && stored.status === "granted") {
    gtag("consent", "update", { analytics_storage: "granted" });
    loadGA();
  } else if (stored && stored.status === "denied") {
    // already denied by default; nothing to load
  } else {
    showBanner();
  }

  const reopenBtn = document.getElementById("cookie-settings-btn");
  if (reopenBtn) {
    reopenBtn.addEventListener("click", showBanner);
  }
}

document.addEventListener("DOMContentLoaded", initConsent);
