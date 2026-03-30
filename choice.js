//#region Základní funkce a Logování
function getParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
}

function getActiveSelectedCheckbox() {
    return document.querySelector('input[type="radio"]:checked');
}

function getLabelFromCheckbox(cbox) { 
    return document.querySelector(`label[for="${cbox.id}"]`);
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function log(...args) {
    if (args.every(arg => arg === "")) return;
    console.log(...args);
}

async function fetchContent(url) {
    let base_url = "https://jenikh.github.io/poz_dat/";
    try {
        const response = await fetch(base_url + url);
        let text = await response.text();
        try {
            

            JSON.parse(text);
        } catch (e) {
            if (e.name === "SyntaxError") {
                console.warn("Cannot load JSON!")
                return {"error": "Nepodařilo se načíst Otázky a odpovědi!"};
            }
        }
        return await JSON.parse(text);
    } catch (e) {
        
        console.error("Chyba při načítání JSON:", e);
        return {};
    }
}

// ✅ NORMALIZACE (jen písmena)
function normalizeName(arr) {
    return arr
        .join(" ")
        .toLowerCase()
        .replace(/[^a-zá-ž]/gi, "");
}
//#endregion

//#region Generování náhodného jména bez duplicit
function getRandomName(keys, cannot_be_again, allData) {
    let fake, normalized;
    let a = 0;
    do {
        const key = keys[Math.floor(Math.random() * keys.length)];
        fake = allData[key];
        a++;
        if (a > 100) { 
            return ["POZOR: Generovací error se stal! -_-\n","s**t"]
        } else {
            if (a % 10 == 0) { 
                log(a)
            }
        }
        if (typeof fake === "string") {
            fake = fake.split(" ");
        }

        normalized = normalizeName(fake);

    } while (cannot_be_again.includes(normalized));

    cannot_be_again.push(normalized);
    return fake;
}
//#endregion

//#region Alerty
async function createAlert(message) {
    return new Promise(resolve => {
        const alertDiv = document.createElement(`div`);
        alertDiv.className = `custom-alert`;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'alert-message';
        messageDiv.textContent = message;

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'alert-buttons';

        const Btn = document.createElement("button");
        Btn.textContent = "Ok";
        Btn.onclick = () => {
            alertDiv.remove();
            resolve("");
        };

        buttonContainer.appendChild(Btn);
        alertDiv.appendChild(messageDiv);
        alertDiv.appendChild(buttonContainer);
        document.body.appendChild(alertDiv);
    });
}

async function createAlertGood(message) {
    
    return new Promise(resolve => {
        
        const alertDiv = document.createElement(`div`);
        alertDiv.className = `custom-alert`;

        const messageDiv = document.createElement('div');
        messageDiv.className = 'alert-message alert-message-good';
        messageDiv.textContent = message;

        const buttonContainer = document.createElement('div');                                       
        buttonContainer.className = 'alert-buttons';
        
        const Btn = document.createElement("button");
        Btn.textContent = "Ok";
        Btn.onclick = () => {
            alertDiv.remove();
            resolve("");
        };
        
        buttonContainer.appendChild(Btn);
        alertDiv.appendChild(messageDiv);
        alertDiv.appendChild(buttonContainer);
        document.body.appendChild(alertDiv);
    });
}

async function createAlertBad(mr,message) {
    return new Promise(resolve => {
        const alertDiv = document.createElement(`div`);
        alertDiv.className = `custom-alert`;

        const messageDiv = document.createElement('div');
        messageDiv.className = 'alert-message';

        const badMessage = document.createElement('div');
        badMessage.className = 'alert-message-bad';
        badMessage.textContent = mr;

        const neutralMessage = document.createElement('div');
        neutralMessage.textContent = message;

        messageDiv.appendChild(badMessage);
        messageDiv.appendChild(neutralMessage);

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'alert-buttons';

        const Btn = document.createElement("button");
        Btn.textContent = "Ok";
        Btn.onclick = () => {
            alertDiv.remove();
            resolve("");
        };

        buttonContainer.appendChild(Btn);
        alertDiv.appendChild(messageDiv);
        alertDiv.appendChild(buttonContainer);
        document.body.appendChild(alertDiv);
    });
}

async function createAlertGoodBad(mr,mg) {
    return new Promise(resolve => {
        const alertDiv = document.createElement(`div`);
        alertDiv.className = `custom-alert`;

        const messageDiv = document.createElement('div');
        messageDiv.className = 'alert-message';

        const badMessage = document.createElement('div');
        badMessage.className = 'alert-message-bad';
        badMessage.textContent = mr;

        const goodMessage = document.createElement('div');
        goodMessage.className = 'alert-message-good';
        goodMessage.textContent = mg;

        messageDiv.appendChild(badMessage);
        messageDiv.appendChild(goodMessage);
        
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'alert-buttons';

        const Btn = document.createElement("button");
        Btn.textContent = "Ok";
        Btn.onclick = () => {
            alertDiv.remove();
            resolve("");
        };

        buttonContainer.appendChild(Btn);
        alertDiv.appendChild(messageDiv);
        alertDiv.appendChild(buttonContainer);
        document.body.appendChild(alertDiv);
    });
}

async function createYesNoAlert(message,str_msg="") {
    return new Promise(resolve => {
        const alertDiv = document.createElement("div");
        alertDiv.className = "custom-alert";

        const messageDiv = document.createElement("div");
        messageDiv.className = "alert-message";
        const strong = document.createElement("strong");
        strong.textContent = str_msg;
        messageDiv.innerHTML = message + strong.outerHTML;

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'alert-buttons';

        const yesBtn = document.createElement("button");
        yesBtn.textContent = "Ano";
        yesBtn.onclick = () => {
            alertDiv.remove();
            resolve(true);
        };

        const noBtn = document.createElement("button");
        noBtn.textContent = "Ne";
        noBtn.onclick = () => {
            alertDiv.remove();
            resolve(false);
        };

        buttonContainer.appendChild(yesBtn);
        buttonContainer.appendChild(noBtn);
        alertDiv.appendChild(messageDiv);
        alertDiv.appendChild(buttonContainer);
        document.body.appendChild(alertDiv);
    });
}
//#endregion Alerty

//#region Hlavní Funkce
async function main() {
    log(`Trenázer v1.2.0 - Startování`);

    const year = getParam(`y`); 
    if (!year) {
        createAlert("Chybí rok v URL! (?y=...)");
        return;
    }

    const f = await fetchContent(`years/${year}/names.json`);
    if (f.error) {
        await createAlertBad(f.error);
        window.location.href = "/"
        return;
    }

    const keys = Object.keys(f);
    const len = keys.length;

    if (len === 0) return;

    const totalQuestions = Math.min(randomInt(len > 10 ? len - 5 : 1, len), len);
    const box_count = 3;

    const container = document.createElement(`div`);
    container.className = `trenazer`;

    let currentQuestion = 0;
    const questionDivs = [];

    // 🔹 GENEROVÁNÍ OTÁZEK
    for (let i = 0; i < totalQuestions; i++) {
        const questionDiv = document.createElement(`div`);
        questionDiv.className = i === 0 ? `active` : `inactive`;
        questionDiv.style.display = i === 0 ? `block` : `none`;

        const correctEntry = f[keys[i]];
        const correctArr = [
            correctEntry[0],
            correctEntry[1]
        ];

        const correctNormalized = normalizeName(correctArr);

        // obrázek
        questionDiv.innerHTML += `
            <div class="img-container">
                <img src="https://jenikh.github.io/poz_dat/years/${year}/pic/${keys[i]}.webp" style="max-width:300px">
            </div>
        `;

        const cannot_be_again = [correctNormalized];
        const options = [correctArr];

        // 🔹 FAKE ODPOVĚDI
        for (let n = 0; n < box_count - 1; n++) {
            options.push(getRandomName(keys, cannot_be_again, f));
        }

        // zamíchání
        options.sort(() => Math.random() - 0.5);

        // 🔹 VYKRESLENÍ
        options.forEach((optValue, j) => {
            const row = document.createElement("div");
            row.className = "checkbox-row";
            
            const box = document.createElement("input");
            box.type = "radio";
            box.id = `q-${i}-opt-${j}`;
            box.name = `q-${i}`;
            box.value = optValue.join(" ");
            box.required = true;
            box.className = "checkbox";
            box.style.display = "block";
            box.style.margin = "10 auto";
            box.style.textAlign = "auto";


            const label = document.createElement("label");
            const label2 = document.createElement("label");
            box.dataset.resultLabelId = `result-${i}-${j}`;
            label2.id = box.dataset.resultLabelId;
            label2.style.display = "none";
            label2.htmlFor = box.id;
            label2.textContent = normalizeName(optValue) === correctNormalized ? "✅" : "❌";
            
            label2.style.display = "none";
            

            label.htmlFor = box.id;
            label.textContent = ` ${optValue.join(" ")}`;
            label.className = "checkbox";
            label2.className = "checkbox";


            row.appendChild(box);
            row.appendChild(label);
            row.appendChild(label2);

            questionDiv.appendChild(row);
        });

        // uložíme správnou odpověď
        questionDiv.dataset.correct = correctNormalized;

        questionDivs.push(questionDiv);
        container.appendChild(questionDiv);
    }

    let submit = document.getElementById("submit");
    let awaiting_another_click = false;
    let body = 0;
    submit.onclick = () => {
        const activeDiv = questionDivs[currentQuestion];
        if (!activeDiv) {
            submit.disabled = true;
            return;
        };
        const selected = activeDiv.querySelector('input[type="radio"]:checked');
        
        if (!(awaiting_another_click)) {
            if (!selected) {
                createAlertBad("Musíte kliknout na jeden z boxů aby jste pokračovali!")
                return;
            };
        
        const selectedNormalized = selected.value
            .toLowerCase()
            .replace(/[^a-zá-ž]/gi, "");

        const correct = activeDiv.dataset.correct;
        const allBoxes = activeDiv.querySelectorAll('input[type="radio"]');

allBoxes.forEach(box => {
    const label = document.getElementById(box.dataset.resultLabelId);
    label.style.display = "inline";

    const normalized = box.value
        .toLowerCase()
        .replace(/[^a-zá-ž]/gi, "");

    if (normalized === correct) {
        label.textContent = "✅";
        if (selectedNormalized == normalized) {
            body = body + 1;
            log(body)
        }
    } else {
        label.textContent = "❌";
    }
});
            awaiting_another_click = true;
            submit.textContent = "Pokračovat!";
            return
        }
        
        
        
        
        // další otázka
        awaiting_another_click = false;
        activeDiv.style.display = "none";

        currentQuestion++;
        if (currentQuestion < questionDivs.length) {
            questionDivs[currentQuestion].style.display = "block";
        } else {
            createAlert("🎉 Hotovo!")
            
        }
    };

    submit.textContent = "Potvrdit!";
    console.log(submit.textContent)
    submit.parentNode.insertBefore(container, submit);
    
}

main();
//#endregion