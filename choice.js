//#region Základní funkce a Logování
function getParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function iglog(...args) {
    if (args.every(arg => arg === "")) return;
    console.log(...args);
}

async function fetchContent(url) {
    let base_url = "https://jenikh.github.io/poz_dat/";
    try {
        const response = await fetch(base_url + url);
        return await response.json();
    } catch (e) {
        console.error("Chyba při načítání JSON:", e);
        return {};
    }
}
//#endregion

//#region Logika Unikátních Hodnot
async function assignUniqueValue(element, allData, cannot_be_again) {
    const keys = Object.keys(allData);
    let randomKey = keys[Math.floor(Math.random() * keys.length)];
    let value = allData[randomKey][0]; // Bereme první slovo (např. "bedla")

    // Pokud už toto jméno v možnostech máme, zkusíme jiné
    while (cannot_be_again.includes(value)) {
        randomKey = keys[Math.floor(Math.random() * keys.length)];
        value = allData[randomKey][0];
    }
    
    element.value = value;
    cannot_be_again.push(value);
}
//#endregion

//#region Hlavní Funkce Main
async function main() {
    iglog(`Trenázer v1.1.0 - Startování`);

    const year = getParam(`y`); 
    if (!year) {
        alert("Chybí rok v URL! (?y=...)");
        return;
    }

    // 1. Načtení dat ze serveru
    const f = await fetchContent(`years/${year}/names.json`);
    const keys = Object.keys(f);
    const len = keys.length;

    if (len === 0) return;

    // Počet otázek (náhodně z rozsahu dat)
    const totalQuestions = Math.min(randomInt(len > 10 ? len - 5 : 1, len), len);
    const box_count = 4;

    const d = document.createElement(`div`);
    d.className = `trenazer`;

    // 2. Generování otázek
    for (let i = 1; i <= totalQuestions; i++) {
        const questionDiv = document.createElement(`div`);
        questionDiv.id = `box-${i}`;
        questionDiv.className = i === 1 ? `active` : `inactive`;
        questionDiv.style.display = i === 1 ? `block` : `none`;

        // Správná odpověď pro tento konkrétní krok (podle klíče v JSONu)
        const correctEntry = f[keys[i - 1]]; 
        const correctName = correctEntry[0] + " " + correctEntry[1]; // např. "bedla"

        // Přidáme obrázek (pokud máš funkci create_img)
        questionDiv.innerHTML += `<div class="img-container"><img src="https://jenikh.github.io/poz_dat/years/${year}/pic/${keys[i-1]}.webp" style="max-width:300px"></div>`;

        const cannot_be_again = [correctName]; // Správná odpověď tam musí být, ale jen jednou
        
        // Vytvoříme pole možností a zamícháme ho
        let options = [correctName];
        for(let n=0; n < box_count - 1; n++) {
            let fakeVal = f[keys[Math.floor(Math.random() * len)]];
            while(cannot_be_again.includes(fakeVal)) {
                fakeVal = f[keys[Math.floor(Math.random() * len)]];
            }
            options.push(fakeVal);
            cannot_be_again.push(fakeVal);
        }
        options.sort(() => Math.random() - 0.5); // Zamíchání

        // 3. Tvorba checkboxů
        options.forEach((optValue, j) => {
            const row = document.createElement("div");
            row.className = "checkbox-row";

            const box = document.createElement("input");
            box.type = "checkbox";
            box.id = `q-${i}-opt-${j}`;
            box.value = optValue;

            const label = document.createElement("label");
            label.htmlFor = box.id;
            label.textContent = ` ${optValue}`;

            // Event listener pro kontrolu
            box.addEventListener('change', async function() {
                if (this.checked) {
                    const check = await answerIsCorrect(this.value, correctName);
                    if (check.correct) {
                        label.style.color = "green";
                        label.textContent += " ✅";
                    } else {
                        label.style.color = "red";
                        label.textContent += " ❌";
                    }
                }
            });

            row.appendChild(box);
            row.appendChild(label);
            questionDiv.appendChild(row);
        });

        d.appendChild(questionDiv);
    }

    document.body.appendChild(d);
}

main();
//#endregion