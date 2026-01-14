function min(num,minimal) {
    if (num <= minimal) {
        return minimal;
    }
    return num;
}
async function assignUniqueValue(element, f, cannot_be_aggin) {
    let value = await pickfromdict(f); // wait for the async function
    while (cannot_be_aggin.includes(value)) {
        value = await pickfromdict(f);
    }
    element.value = value;
    cannot_be_aggin.push(value);
}

function randomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
function log(message, ln = 1) {
    if (getParam("debug") == "true") {
        iglog(message, "in",ln);
    } else {
        console.warn("Enable logging to see logs!\nYou might be asking why? and thats becouse i dont want ANYONE snooping around!")
    }
}
function iglog(message, message2 = "", message3 = "", message4 = "") {
    if (message == "" && message2 == "" && message3 == "" && message4 == "") {
        return;
    }
    if (message2 == "" && message3 == "" && message4 == "") {
        console.log(message);
        return;
    }
    if (message3 == "" && message4 == "") {
        console.log(message, message2);
        return;
    }
    if (message4 == "") {
        console.log(message, message2, message3);
        return;
    }
    
    console.log(message,message2,message3,message4);
}
iglog(`Trenázer v1.1.0`);
setCookie(`test_is_running`, true, 1);
log(typeof notifications_bad);
if (typeof notifications_bad === "undefined") {
    notifications_bad = true;
    log(`notifications_bad is undefined, defaulting to true`,10);
}
var click_button = false;
var host = window.location.hostname
if (window.location.host.includes("localhost")) {
    const url = new URL(window.location.href);
    url.searchParams.set("debug", "true");
    log(getParam("debug"))
    if ( getParam("debug") == null) {
        window.location.href = url.toString();
    }
}
async function answerIsCorrect(answer, correct) {
    const skip = ["y", "i", "ý", "í"];

    const normalizedAnswer = normalize(answer.toLowerCase());
    const normalizedCorrect = normalize(correct.toLowerCase());
    if (normalizedAnswer === "true") return { correct: true, t_c: 0 };
    if (normalizedAnswer === "false") return { correct: false, t_c: 0 };
    // Exact or normalized match
    if (normalizedAnswer === normalizedCorrect) return { correct: true, t_c: 0 };

    // Compute Levenshtein distance while ignoring skip letters
    const r = levenshteinDistanceIgnoreSkip(normalizedAnswer, normalizedCorrect, skip);

    return { correct: r <= 1, t_c: r };
}

// Normalize Czech letters to their base form
function normalize(str) {
    const ssmMap = {
        "á": "a", "č": "c", "ď": "d", "é": "e", "ě": "e",
        "í": "i", "ň": "n", "ó": "o", "ř": "r", "š": "s",
        "ť": "t", "ú": "u", "ů": "u", "ý": "y", "ž": "z"
    };
    return str.split("").map(c => ssmMap[c] || c).join("");
}

// Levenshtein distance ignoring skip letters
function levenshteinDistanceIgnoreSkip(a, b, skip) {
    const m = a.length;
    const n = b.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (a[i - 1] === b[j - 1] || (skip.includes(a[i - 1]) && skip.includes(b[j - 1]))) {
                dp[i][j] = dp[i - 1][j - 1]; // no cost for skip letters
            } else {
                dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
            }
        }
    }

    return dp[m][n];
}



let score = 0;
let currentIndex = 1;
async function get_len_img(content) {
    try {

        count = Object.keys(content).length;
        log("Count: ",count )
        lengthf = Number(count);
        if (lengthf == 0) { 
            log("Freak mode enabled!")
            return 0
        }
        log("Total images:", lengthf);
        
        return lengthf;
    } catch {e} {
        log(e)
        return randomInt(1,20)
    }
}
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

async function createYesNoAlert(message) {
    return new Promise(resolve => {
        const alertDiv = document.createElement("div");
        alertDiv.className = "custom-alert";

        const messageDiv = document.createElement("div");
        messageDiv.className = "alert-message";
        messageDiv.textContent = message;

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
//#region Základ
function create_img(i) {
            return `<img src="${get_pic_url(i)}" alt="Obrázek ${i}">`;
}
function getParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
}
function get_pic_url(i) {
            return base_url + `years/${year}/pic/${i}${end_file}`;
}

function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = `${name}=${value};${expires};path=/`;
}

function goToWeb(url) {
    window.location.href = url;
}
async function fetchContent(url) {
            try {log(base_url)} catch (e) {
                base_url = "https://jenikh.github.io/poz_dat/";
            }
            try {
                const response = await fetch(base_url + url);
                return await response.json();
            } catch (e) {
                log("Chyba při načítání nebo parsování JSON:", e);
                return {};
            }
}
async function pickfromdict(dict) {
    return dict[Math.floor(Math.random() * dict.length)];
}
//#endregion Základ
async function main() {
    (async () => {
       
        if (getCookie("streak_ch") == undefined) {
            setCookie("streak_ch", 0, 1);
        }
        log(`Test: Activated`);
        document.getElementById(`title`).textContent = `Poznávání přírodnin - Test`;

        year = getParam(`y`);
        log(year)
        end_file = `.webp`;

        const f = await fetchContent(`years/${year}/names.json`)
        //#region Streak Alerty
        setCookie("streak",Math.round(getCookie("streak_ch")),1)
        if (getCookie("streak_ch") == 1) {
            createAlertGood("Velmi dobře!\nMáte jedno kompletně správné cvičení za sebou.")
            if (await createYesNoAlert("Baví vás to?")) {
                createAlert("Děkujeme!")
            } else {
                createAlert("Děkujeme i tak!\nNic se nezmění!\n (Ani by se nezměnilo)")
            }
        }
        else if (getCookie("streak_ch") == 2) {
            createAlertGood("Velmi dobře!\nMáte dvě kompletně správná cvičení za sebou.")
        } else if (getCookie("streak_ch") == 3) {
            createAlertGood("Velmi dobře!\nMáte tři kompletně správná cvičení za sebou.")
        } else if (getCookie("streak_ch") == 4) {
            createAlertGood("Velmi dobře!\nMáte čtyři kompletně správná cvičení za sebou.")
        } else if (!(getCookie("streak_ch") == 0)) {
            createAlertGood(`Velmi dobře!\nMáte "${convertIntToText(getCookie("streak_ch"))}" kompletně správných cvičení za sebou.`)
        }
        //#endregion Streak Alerty
        
        
        log("Len")
        const len = await get_len_img(f);
        log(len);
        const totalQuestions = min(randomInt(len - 12, len - 5),len)
        
        log("NOW BOX HANDLE")
        log(totalQuestions)
        //#region Box Handle
        const box_list = []
        const box_dict = {}
        const desc_dict = {}
        const d = document.createElement(`div`);
        d.className = `trenazer`;
        const box_count = 4;
        for (let i = 1; i <= totalQuestions; i++) {
            const div = document.createElement(`div`);
            const boxes = [];
            var box;
            var id;
            var label;
            for (let j = 0; j < box_count; j++) {
                label = document.createElement("label")
                
                box = document.createElement("input")
                box.type = "checkbox";
                box.checked = false;
                var id = randomInt(1, 100000000000000000000000000)
                box.id = id;
                label.for = box.id
                desc_dict[box] = label;
                label.innerHTML = "I have a boat"
                boxes.push(box);
                boxes.push(label);
            }
            log(boxes)
            box_list.push(boxes);
            div.className = i === 1 ? `active` : `inactive`;
            div.style.display = i === 1 ? `block` : `none`;
            div.id = `box-${i}`;
            for (let j = 0; j < box_count; j++) {
                div.appendChild(boxes[j]);
            }
            d.appendChild(div);
            div.innerHTML += `<!--[${f[i][0]},${f[i][1]}]-->`;
        }
        document.body.appendChild(d);
        console.log(box_list)
        //#endregion Box Handle
        for (let i = 0; i < box_list.length; i++) {
            const cannot_be_aggin = []
            const e = box_list[i];
            for (let j = 0; j < e.length; j++) {
                const element = e[j];
                await assignUniqueValue(element, f, cannot_be_aggin)
                const label = document.createElement("label")
                label.for = element.id
                label.innerHTML = "I have a boat"
            
            }
            
        }
    })();
}

async function force_complete_ins() {
    if (false && !click_button) {
        await createAlert(`Pouze po kliknutí na tlačítko s odpovědí`);
        return;
    }
    
    const year = getParam(`y`);
    let f = await fetchContent(`years/${year}/names.json`)
    let totalQuestions = await get_len_img(f)
    if (currentIndex > totalQuestions) return;
    currentIndex = totalQuestions + 1;
    await createAlert(`Test hotov! Body: ${score} / ${totalQuestions * 2}`);
    setCookie(`test_is_running`, false, 1);
    if (await createYesNoAlert(`Chcete znovu pustit test?`)) {
        location.reload();
    }
}
log(document.readyState);

main(); // If trenazer.js is injected after DOM is ready, this is safe
