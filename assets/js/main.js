const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const nav = $("#navLinks");
const menuBtn = $("#menuBtn");
const themeBtn = $("#themeBtn");
const backTop = $("#backTop");

function closeMenu() {
  nav?.classList.remove("open");
  menuBtn?.setAttribute("aria-expanded", "false");
  menuBtn?.setAttribute("aria-label", "Open menu");
}

menuBtn?.addEventListener("click", () => {
  const isOpen = !nav?.classList.contains("open");
  nav?.classList.toggle("open", isOpen);
  menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  menuBtn.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    closeMenu();
  });
});

document.addEventListener("click", (event) => {
  const header = menuBtn?.closest(".site-header");
  if (nav?.classList.contains("open") && header && !header.contains(event.target)) {
    closeMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && nav?.classList.contains("open")) closeMenu();
});

addEventListener("resize", () => {
  if (innerWidth > 1120 && nav?.classList.contains("open")) closeMenu();
});

function syncThemeButton() {
  const isLight = document.documentElement.dataset.theme === "light";
  themeBtn?.setAttribute("aria-label", `Switch to ${isLight ? "dark" : "light"} theme`);
  themeBtn?.setAttribute("title", `Switch to ${isLight ? "dark" : "light"} theme`);
}

themeBtn?.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "light" ? "dark" : "light";
  document.documentElement.dataset.theme = nextTheme;
  localStorage.theme = nextTheme;
  syncThemeButton();
});

if (localStorage.theme) {
  document.documentElement.dataset.theme = localStorage.theme;
}

syncThemeButton();

addEventListener("scroll", () => {
  const progress = $("#progress");
  const maxScroll = Math.max(document.body.scrollHeight - innerHeight, 1);
  if (progress) progress.style.width = `${(scrollY / maxScroll) * 100}%`;
  backTop?.classList.toggle("show", scrollY > 500);
});

backTop?.addEventListener("click", () => {
  scrollTo({ top: 0, behavior: "smooth" });
});

function filterCards(query) {
  const normalized = (query || "").toLowerCase();
  $$("[data-title]").forEach((card) => {
    const title = card.dataset.title?.toLowerCase() || "";
    const description = card.dataset.desc?.toLowerCase() || "";
    card.style.display = title.includes(normalized) || description.includes(normalized) ? "" : "none";
  });
}

$("#siteSearch")?.addEventListener("input", (event) => {
  filterCards(event.target.value);
});

$("#grokSearch")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = $("#grokQuery")?.value.trim();
  if (!query) return; // stops empty search
  const target = new URL("https://grokipedia.com/search");
  target.searchParams.set("q", query);
  window.open(target.toString(), "_blank", "noopener,noreferrer");
});

function getNewsletterStatus(form) {
  let status = form.querySelector(".newsletter-status");
  if (!status) {
    status = document.createElement("p");
    status.className = "newsletter-status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    status.hidden = true;
    form.append(status);
  }
  return status;
}

function setNewsletterMessage(form, state, message) {
  const status = getNewsletterStatus(form);
  status.textContent = message;
  status.dataset.state = state;
  status.hidden = false;
  form.dataset.state = state;
}

$$(".newsletter-form").forEach((form) => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (form.dataset.loading === "true") return;

    const emailInput = form.querySelector('input[type="email"], input[name="email"]');
    if (!emailInput || !form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const button = form.querySelector('button[type="submit"]');
    const endpoint = form.getAttribute("action") || "/api/newsletter";
    const originalButtonText = button?.textContent || "Subscribe";

    form.dataset.loading = "true";
    form.classList.add("is-loading");
    if (button) {
      button.disabled = true;
      button.textContent = "Sending...";
    }
    setNewsletterMessage(form, "pending", "Sending your signup...");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailInput.value.trim(),
          source: location.pathname,
        }),
      });

      let data = {};
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        data = await response.json();
      }

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || "Signup failed.");
      }

      setNewsletterMessage(form, "success", data.message || "Thanks! You are subscribed.");
      form.reset();
    } catch (error) {
      setNewsletterMessage(form, "error", "Sorry, signup could not be sent. Please try again.");
    } finally {
      form.dataset.loading = "false";
      form.classList.remove("is-loading");
      if (button) {
        button.disabled = false;
        button.textContent = originalButtonText;
      }
    }
  });
});

const params = new URLSearchParams(location.search);
const query = params.get("q");
if (query && $("#siteSearch")) {
  $("#siteSearch").value = query;
  filterCards(query);
}

if (query && $("#navSearchInput")) {
  $("#navSearchInput").value = query;
}

const currentPath = location.pathname.replace(/\/$/, "") || "/";
nav?.querySelectorAll("a[href]").forEach((link) => {
  const href = link.getAttribute("href") || "";
  const linkPath = href.replace(/\/$/, "") || "/";
  const isBlog = currentPath.startsWith("/blog") && href === "/blog/";
  const isAiSearch = currentPath.startsWith("/category/ai-search-engines") && href.includes("ai-search-engines");
  if (linkPath === currentPath || isBlog || isAiSearch) {
    link.classList.add("active");
    link.setAttribute("aria-current", "page");
  }
});
