const lin = document.head.appendChild(document.createElement("link"));
lin.rel = "icon";
lin.href = "icon.png";

async function main() {
    let year;
    try {
        year = getParam("y");
        if (year === null) throw new Error("Parametr 'y' chybí.");
    } catch (e) {
        throw new Error("Neplatný rok: " + e.message);
    }

    async function fetch_content(url) {
        try {
            const response = await fetch("https://jenikh.github.io/poz_dat/" + url);
            return await response.json();
        } catch (e) {
            console.error("Chyba při načítání nebo parsování JSON:", e);
            return null;
        }
    }

    const names = await fetch_content("names.json");

    // Nastavení titulku
    let titleText;
    const num_year = Number(year);
    if (isNaN(num_year)) {
        try {
            titleText = "Rok " + (names?.[year] ?? year); // Fallback, pokud names[year] není
        } catch (e) {
            titleText = "Rok " + year;
            console.error("Neplatný rok:", e.message);
        }
    } else {
        titleText = `Poznávačka - Rok ${num_year}/${num_year + 1}`;
    }

    document.getElementById("title").textContent = titleText;
    document.getElementById("title_h1").textContent = titleText;

    const butt = document.getElementById("b_select");
    const trenazerParam = getParam("trenazer");

    console.log("Trenazer:", trenazerParam);

    if (trenazerParam === null) {
        console.log("Year:", year);

        butt.addEventListener("click", () => {
            document.getElementById("list_b").style.display = "block";
            butt.style.display = "none";
        });

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
