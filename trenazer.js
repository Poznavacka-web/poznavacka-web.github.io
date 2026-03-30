function min(num,minimal) {
    if (num <= minimal) {
        return minimal;
    }
    return num;
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
function iglog(message,message2="",message3="",message4="") {
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
//#endregion Základ
async function main() {
    (async () => {
       
        if (getCookie("streak") == undefined) {
            setCookie("streak", 0, 1);
        }
        log(`Test: Activated`);
        document.getElementById(`title`).textContent = `Poznávání přírodnin - Test`;
        document.getElementById(`style`).href = `./test.css`;

        year = getParam(`y`);
        log(year)
        end_file = `.webp`;

        const f = await fetchContent(`years/${year}/names.json`)
        //#region Streak Alerty
        setCookie("streak",Math.round(getCookie("streak")),1)
        if (getCookie("streak") == 1) {
            createAlertGood("Velmi dobře!\nMáte jedno kompletně správné cvičení za sebou.")
            if (await createYesNoAlert("Baví vás to?")) {
                createAlert("Děkujeme!")
            } else {
                createAlert("Děkujeme i tak!\nNic se nezmění!\n (Ani by se nezměnilo)")
            }
        }
        else if (getCookie("streak") == 2) {
            createAlertGood("Velmi dobře!\nMáte dvě kompletně správná cvičení za sebou.")
        } else if (getCookie("streak") == 3) {
            createAlertGood("Velmi dobře!\nMáte tři kompletně správná cvičení za sebou.")
        } else if (getCookie("streak") == 4) {
            createAlertGood("Velmi dobře!\nMáte čtyři kompletně správná cvičení za sebou.")
        } else if (!(getCookie("streak") == 0)) {
            createAlertGood(`Velmi dobře!\nMáte "${convertIntToText(getCookie("streak"))}" kompletně správných cvičení za sebou.`)
        }
        //#endregion Streak Alerty
        
        
        log("Len")
        const len = await get_len_img(f);
        log(len);
        const totalQuestions = min(randomInt(len - 12, len - 5),len)
        
        log("NOW BOX HANDLE")
        log(totalQuestions)
        //#region Box Handle
        const d = document.createElement(`div`);
        d.className = `trenazer`;

        const usedPics = new Set();

        for (let i = 1; i <= totalQuestions; i++) {
            let number_pic;
            do {
                log(usedPics)
                number_pic = randomInt(1, len);
            } while (usedPics.has(number_pic));
            usedPics.add(number_pic);

            const div = document.createElement(`div`);
            div.className = i === 1 ? `active` : `inactive`;
            div.style.display = i === 1 ? `block` : `none`;
            div.id = `box-${i}`;
            div.innerHTML = create_img(number_pic);
            div.innerHTML += `<!--[${f[number_pic][0]},${f[number_pic][1]}]-->`;
            d.appendChild(div);
        }

        document.body.appendChild(d);
        //#endregion Box Handle
        //#region 
        const points = document.createElement(`p`);
        points.textContent = "0/" + toString(totalQuestions * 2);
        points.id = `points`;

        document.body.appendChild(points);
        const input = document.createElement(`input`);
        input.id = `input`;
        input.autocorrect = `off`;
        input.autocapitalize = `off`;
        input.spellcheck = false;
        input.autofocus = true;
        input.autocomplete = `off`;

        const button = document.getElementById("Check");
        button.type = `submit`;
        button.value = `Ověřit`;

        const exit = document.createElement(`input`);
        exit.type = `submit`;
        exit.value = `Konec`;
        exit.className = "button"
        exit.style.backgroundColor = "red";
        exit.style.color = "white";
        exit.onclick = async () => {
            
            if (exit.value == "Super tajné talčítko!") {
                await createAlertGood("BAM STŘÍLEČKA V KÓDU!")
                var s = document.createElement('script')
                s.type = 'text/javascript'
                document.body.appendChild(s);
                s.src = './strilecka.js'
                exit.disabled = true;
                button.disabled = true;
                input.disabled = true;
                setCookie("test_is_running", false, 1);
                for (let index = 0; index < document.getElementById("trenazer").children.length; index++) {
                    const element = document.getElementById("trenazer").children[index];
                    element.style.display = "";
                }
                
                return;
            }
            if (!await createYesNoAlert("Opravdu chcete ","ukončit test?")) {
                return;
            }
            setCookie("test_is_running", false, 1);
            goToWeb(`./year.html?y=${year}`);
        }
        // Proč jsem to neudělal dřív
        const c_element = document.getElementById("content_b").parentNode
        c_element.removeChild(c_element.firstChild)
        document.body.removeChild(c_element)
        const inputContainer = document.createElement(`div`);
        inputContainer.id = `input-container`;
        inputContainer.appendChild(input);
        inputContainer.appendChild(document.createElement(`br`));
        inputContainer.appendChild(button);
        inputContainer.appendChild(document.createElement(`br`));
        inputContainer.appendChild(exit)
        document.getElementById("cnt").removeChild(document.getElementById("zpet"))
        document.body.appendChild(inputContainer);

        button.onclick = async () => {
            input.focus()
            let active = document.querySelector(`.active`);
            if (!active) {
                button.disabled = false;
                let next = document.getElementById(`box-${currentIndex}`);
                // box-1 a nebo box-30
                if (next == null) {
                    let next = document.getElementById(`box-${currentIndex + randomInt(-1, 1)}`)
                }
                if (next == null) {
                    let a = 0
                    while (next == null) {
                        next = document.getElementById(`box-${randomInt(1, totalQuestions)}`);
                        a++;
                        if (a >= totalQuestions) { 
                            if (currentIndex > totalQuestions) {
                score = totalQuestions * 2
                await createAlert(`Test hotov! Body: ${score} / ${totalQuestions * 2}`);
                setCookie(`test_is_running`, false, 1);
                if ((totalQuestions * 2) == score) {
                    log("Very good!")
                    setCookie("streak", Number(getCookie("streak")) + 1, 1);
                }
                                if (await createYesNoAlert(`Chcete znovu pustit test?`)) {
                                    location.reload();
                                } else {
                                    goToWeb(`./roky.html`);
                                }}
                        }
                    }
                }
                next.className = `active`;
                next.style.display = `block`;
                input.value = ``;
                input.focus();
                setCookie(`test_is_running`, true, 1);
                return;
            };
            const comment = active.innerHTML.split(`<!--[`)[1]?.split(`]-->`)[0];
            
            let [correctFirst, correctSecond] = comment.split(`,`);
            const answer = input.value.trim().toLowerCase().split(` `);
            log(answer);
            log(correctFirst);
            log(correctSecond);
            correctFirst = correctFirst.charAt(0).toUpperCase() + correctFirst.slice(1);
            correctSecond = correctSecond.toLocaleLowerCase()
            let bad_answer_1 = false;
            let bad_answer_2 = false;
            if (answer[0] == `tajemstvi`) {
                await createAlertGood("Žádné tajnosti! (:")
                exit.value = "Super tajné talčítko!";
                return;
            }
            if (answer.length === 1) {
                answer.push(` _g_`);
            } else if (answer.length !== 2) {
                input.value = ``;
                log(answer.length)
                log(`Invalid answer`);
                return;
            }
            
            aic = await answerIsCorrect(answer[0], correctFirst)
            aic_2 = await answerIsCorrect(answer[1], correctSecond)
            log(aic)
            log(aic_2)
            ans_1 = aic.correct
            ans_2 = aic_2.correct
            i_1 = aic.t_c
            i_2 = aic_2.t_c
            if (i_1 == undefined && i_2 == undefined) {
                i_1 = 0
                i_2 = 0
            } else if (i_1 == undefined) {
                i_1 = 0
            } else if (i_2 == undefined) {
                i_2 = 0
            }
            if (ans_1) {
                score += 1;
            } else {
                bad_answer_1 = true;
            }

            if (ans_2) {
                score += 1;
            } else {
                bad_answer_2 = true;
            }
            
            log(ans_1)
            log(ans_2)

            if (notifications_bad) {
                if (bad_answer_1 && bad_answer_2) {
                    button.disabled = true;
                    await createAlertBad(`Nesprávná odpověď (celá)`,`Bylo to: ${correctFirst} ${correctSecond}`);
                } else if (bad_answer_1) {
                    button.disabled = true;
                    await createAlertBad(`Nesprávné první jméno`,`Bylo to: ${correctFirst} ${correctSecond}`);
                } else if (bad_answer_2) {
                    button.disabled = true;
                    await createAlertBad(`Nesprávné druhé jméno`,`Bylo to: ${correctFirst} ${correctSecond}`);
                }
                if (i_1 == 1 && i_2 == 1) {
                    createAlertGoodBad("Dvě chyby v odpovědi ( 1 v prvním jménu, 1 v druhém jménu)","Ale je to správné!")
                } else if (i_1 == 1) {
                    createAlertGoodBad("Jedna chyba v prvním jménu","Ale je to správné!")
                } else if (i_2 == 1) {
                    createAlertGoodBad("Jedna chyba v druhém jménu","Ale je to správné!")
                }
            }


            click_button = true;
            active.className = `inactive`;
            active.style.display = `none`;
            currentIndex++;
            
            if (currentIndex > totalQuestions) {
                //score = totalQuestions * 2
                await createAlert(`Test hotov! Body: ${score} / ${totalQuestions * 2}`);
                setCookie(`test_is_running`, false, 1);
                if ((totalQuestions * 2) == score) {
                    log("Very good!")
                    setCookie("streak", Math.round(getCookie("streak") + Math.round(totalQuestions / 1.5, 1)));
                }
                if (await createYesNoAlert(`Chcete znovu pustit test?`)) {
                    location.reload();
                } else {
                    goToWeb(`./roky.html`);
                }
            } else {
                button.disabled = false;
                let next = document.getElementById(`box-${currentIndex}`);
                if (next == null) {
                    let next = document.getElementById(`box-${currentIndex + randomInt(-1, 1)}`)
                }
                next.className = `active`;
                next.style.display = `block`;
                input.value = ``;
                input.focus();
                setCookie(`test_is_running`, true, 1);
            }

        };
    })();
}

async function force_complete_ins() {
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

main();
