const lin = document.head.appendChild(document.createElement("link"));
lin.rel = "icon";
lin.href = "icon.png";
async function fetch_content(url) {
        try { console.log(base_url) } catch (e) { 
            base_url = "https://jenikh.github.io/poz_dat/";
        }
        try {
            const response = await fetch(base_url + url);
            return await response.json();
        } catch (e) {

            console.log("Chyba při načítání nebo parsování JSON:", e);
            return null;
        }
    }
async function main() {
    let year;
    try {
        year = getParam("y");
        if (year === null) throw new Error("Parametr 'y' chybí.");
    } catch (e) {
        throw new Error("Neplatný rok: " + e.message);
    }
    console.log(year)
    const names = await fetch_content("names.json");
    // Nastavení titulku
    let titleText;
    console.log(year)
    console.log(Number(year))
    const num_year = Number(year);
        console.log("nan")
    try {
        titleText = names?.[year] ?? year; // Fallback, pokud names[year] není
    } catch (e) {
        titleText = year;
        console.error("Neplatný rok:", e.message);
    }

    document.getElementById("title").textContent = "Poznávání přírodnin - " + titleText;
    document.getElementById("title_h1").textContent ="Poznávání přírodnin - " + titleText;

    const trenazerParam = getParam("trenazer");

    console.log("Trenazer:", trenazerParam);

    if (trenazerParam === null) {
        console.log("Year:", year);

        

        document.getElementById("b_odpovedi").addEventListener("click", () => {
            goToWeb(`./year.html?y=${year}&trenazer=false`);
        });

        document.getElementById("b_trenazer").addEventListener("click", () => {
            goToWeb(`./year.html?y=${year}&trenazer=true`);
        });

    } else if (trenazerParam === "false") {
        const select = document.getElementById("select");
        if (select) select.remove();

        const script = document.createElement("script");
    script.src = "./zvirata.js";
    script.id = "script_extra";
    script.async = false; // optional: ensures order
    document.body.appendChild(script);


        const yearScript = document.getElementById("script_year");
        if (yearScript) yearScript.remove();

    } else {
        const select = document.getElementById("select");
        if (select) select.remove();

        const script = document.createElement("script");
    script.src = "./trenazer.js";
    script.id = "script_extra";
    script.async = false; // optional: ensures order
    script.defer = true;
    document.body.appendChild(script);


        const yearScript = document.getElementById("script_year");
        if (yearScript) yearScript.remove();
    }
}

// Spusť hlavní funkci
document.addEventListener("DOMContentLoaded", () => {
    main(); // <- your async function
});
