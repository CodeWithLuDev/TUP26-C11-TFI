const THEME_KEY = "cp26_theme";

export function showToast(message, type = "success") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast--${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("toast--exit");
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

export function initTheme() {
  const toggle = document.getElementById("themeToggle");
  if (!toggle) return;

  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "light") {
    document.documentElement.setAttribute("data-theme", "light");
    toggle.textContent = "☀️";
  }

  toggle.addEventListener("click", () => {
    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    if (isLight) {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem(THEME_KEY, "dark");
      toggle.textContent = "🌙";
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem(THEME_KEY, "light");
      toggle.textContent = "☀️";
    }
  });
}

export function initHamburger() {
  const btn = document.getElementById("navHamburger");
  const collapse = document.getElementById("navbarCollapse");
  if (!btn || !collapse) return;

  btn.addEventListener("click", () => {
    collapse.classList.toggle("open");
  });

  document.addEventListener("click", e => {
    if (!btn.contains(e.target) && !collapse.contains(e.target)) {
      collapse.classList.remove("open");
    }
  });
}
