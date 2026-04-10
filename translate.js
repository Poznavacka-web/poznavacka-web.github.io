// =======================
// CONFIG
// =======================
const BASE_URL = "https://jenikh.github.io/poz_dat/lang/";
const DEFAULT_LANG = "cs";

// =======================
// CACHE
// =======================
const lang_cache = {};

// =======================
// FETCH LANGUAGE FILE
// =======================
async function fetchLang(lang) {
    if (lang_cache[lang]) return lang_cache[lang];

    try {
        const response = await fetch(`${BASE_URL}${lang}.json`);
        if (response.status === 404) {
            return { "fallback": true };
        }
        if (!response.ok) throw new Error("HTTP error");

        const data = await response.json();
        lang_cache[lang] = data;
        return data;
    } catch (e) {
        console.error("Language load error:", e);
    }
}

// =======================
// TRANSLATE FUNCTION
// =======================
async function translate(key, lang) {
    const dict = await fetchLang(lang);

    if (dict.error) return dict.error;
    if (dict.fallback) return dict;

    return dict[key] || { "fallback": true}; // fallback to key
}

// =======================
// TRANSLATE ELEMENT
// =======================
async function translateElement(element, lang) {
    const key = element.getAttribute("translation-key");
    if (!key) return;

    const text = await translate(key, lang);
    if (typeof text === typeof {"fallback": true}) element.textContent = element.textContent
    else element.textContent = text;
}

// =======================
// TRANSLATE ALL ELEMENTS
// =======================
async function translateAll(lang) {
    console.log("Translating page...");

    const elements = document.querySelectorAll("[translation-key]");

    for (const el of elements) {
        await translateElement(el, lang);
    }

    console.log("Translation done!");
}

// =======================
// OBSERVER (for dynamic elements)
// =======================
function observeNewElements(lang) {
    const observer = new MutationObserver(async (mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType !== 1) continue;

                // If the node itself has translation-key
                if (node.hasAttribute && node.hasAttribute("translation-key")) {
                    await translateElement(node, lang);
                }

                // If children have translation-key
                const children = node.querySelectorAll?.("[translation-key]");
                if (children) {
                    for (const child of children) {
                        await translateElement(child, lang);
                    }
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// =======================
// INIT
// =======================
document.addEventListener("DOMContentLoaded", async () => {
    const lang = DEFAULT_LANG; // you can change or detect

    await translateAll(lang);
    observeNewElements(lang);
});