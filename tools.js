
const link = document.createElement("link")
    link.rel = "stylesheet";
    link.href = "style.css";
document.head.appendChild(link);

const scr = document.createElement("script");
scr.src = "settings.js";  // Corrected from .scr to .src
scr.id = "script_settings";
document.head.appendChild(scr);

function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
function convertIntToText(number) {
  const num_1 = ["nula","jedna","dvě","tři","čtyři","pět","šest","sedm","osm","devět",
                 "deset","jedenáct","dvanáct","třináct","čtrnáct","patnáct","šestnáct",
                 "sedmnáct","osmnáct","devatenáct"];

  const num_2 = ["dvacet","třicet","čtyřicet","padesát","šedesát","sedmdesát","osmdesát","devadesát"];

  const num_3 = ["sto","dvěstě","třista","čtyřista","pětset","šestset","sedmset","osmset","devětset"];

  const units = [
    {singular:"", paucal:"", plural:""},               // units < 1000
    {singular:"tisíc", paucal:"tisíce", plural:"tisíc"},  // 1,000
    {singular:"milion", paucal:"miliony", plural:"milionů"}, // 1,000,000
    {singular:"miliarda", paucal:"miliardy", plural:"miliard"}, // 1,000,000,000
    {singular:"bilion", paucal:"biliony", plural:"bilionů"} // 1,000,000,000,000
  ];

  function convertBelowThousand(n) {
    if (n <= 19) return num_1[n];
    else if (n <= 99) {
      let tens = Math.floor(n / 10);
      let ones = n % 10;
      let result = num_2[tens - 2];
      if (ones > 0) result += " " + num_1[ones];
      return result;
    } else {
      let hundreds = Math.floor(n / 100);
      let remainder = n % 100;
      let result = num_3[hundreds - 1];
      if (remainder > 0) result += " " + convertBelowThousand(remainder);
      return result;
    }
  }

  function pluralize(n, singular, paucal, plural) {
    // Determine correct Czech form
    if (n === 1) return singular;
    if (n >= 2 && n <= 4) return paucal;
    return plural;
  }

  if (number === 0) return "nula";
  if (number < 0) {
      pos = number.split("-")[1]
      return `mínus ${convertIntToText(pos)}`
      
  }
  let parts = [];
  let unitIndex = 0;

  while (number > 0 && unitIndex < units.length) {
    let chunk = number % 1000;
    if (chunk > 0) {
      let chunkText = convertBelowThousand(chunk);
      if (unitIndex > 0) {
        chunkText += " " + pluralize(chunk, units[unitIndex].singular, units[unitIndex].paucal, units[unitIndex].plural);
      }
      parts.unshift(chunkText);
    }
    number = Math.floor(number / 1000);
    unitIndex++;
  }
  
  return parts.join(" ");
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
