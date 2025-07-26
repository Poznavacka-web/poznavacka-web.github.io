
document.addEventListener("DOMContentLoaded", () => {
    const scr = document.createElement("script");
    scr.src = "settings.js";  // Corrected from .scr to .src
    scr.id = "script_settings";
    document.body.appendChild(scr);
});

function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length, c.length);
    }
  }
  return null;
}

function deleteCookie(name) {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
}

function goToWeb(url) {
  window.location.href = url;
}

function getParam(key) {
  const url = new URL(window.location.href);
  return url.searchParams.get(key);
}
