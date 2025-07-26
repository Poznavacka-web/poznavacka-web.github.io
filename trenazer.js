
console.log(`Trenázer v1.0.0`);
console.log(typeof notifications_bad);
if (typeof notifications_bad === "undefined") {
    notifications_bad = true;
    console.log(`notifications_bad is undefined, defaulting to true`);
}
var click_button = false;

let score = 0;
let currentIndex = 1;
const totalQuestions = 8;
async function createAlert(message) {
    return new Promise(resolve => {
    const alertDiv = document.createElement(`div`);
    alertDiv.className = `custom-alert`;
    alertDiv.style.position = `fixed`;
    alertDiv.style.top = `50%`;
    alertDiv.style.left = `50%`;
    alertDiv.style.transform = `translate(-50%, -50%)`;
    alertDiv.style.backgroundColor = `#fff`;
    alertDiv.style.border = `1px solid #ccc`;
    alertDiv.style.padding = `20px`;
    alertDiv.style.boxShadow = `0 0 10px rgba(0,0,0,0.2)`;
    alertDiv.style.zIndex = `9999`;
    alertDiv.style.fontFamily = `sans-serif`;
    alertDiv.style.textAlign = `center`;
    
    const Btn = document.createElement("button");
        Btn.textContent = "Ok";
        Btn.onclick = () => {
            alertDiv.remove();
            resolve("");
        };
        alertDiv.innerHTML = `
            <div style="margin-bottom: 10px;">${message}</div>`
        alertDiv.appendChild(Btn);
        document.body.appendChild(alertDiv);
    });
}
async function createYesNoAlert(message) {
    return new Promise(resolve => {
        const alertDiv = document.createElement("div");
        alertDiv.className = "custom-alert";
        alertDiv.style.position = "fixed";
        alertDiv.style.top = "50%";
        alertDiv.style.left = "50%";
        alertDiv.style.transform = "translate(-50%, -50%)";
        alertDiv.style.backgroundColor = "#fff";
        alertDiv.style.border = "1px solid #ccc";
        alertDiv.style.padding = "20px";
        alertDiv.style.boxShadow = "0 0 10px rgba(0,0,0,0.2)";
        alertDiv.style.zIndex = "9998";
        alertDiv.style.fontFamily = "sans-serif";
        alertDiv.style.textAlign = "center";

        const messageDiv = document.createElement("div");
        messageDiv.style.marginBottom = "10px";
        messageDiv.textContent = message;

        const yesBtn = document.createElement("button");
        yesBtn.textContent = "Yes";
        yesBtn.onclick = () => {
            alertDiv.remove();
            resolve(true);
        };

        const noBtn = document.createElement("button");
        noBtn.textContent = "No";
        noBtn.onclick = () => {
            alertDiv.remove();
            resolve(false);
        };

        alertDiv.appendChild(messageDiv);
        alertDiv.appendChild(yesBtn);
        alertDiv.appendChild(noBtn);
        document.body.appendChild(alertDiv);
    });
}



function getParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
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

async function main() {
    console.log("MAIN FUNCTION STARTED ✅");
    
    (async () => {

        console.log(`Test: Activated`);
        document.getElementById(`title`).textContent = `Poznávačka - Test`;
        document.getElementById(`style`).href = `./test.css`;

        const year = getParam(`y`);
        const end_file = `.png`;

        const f = await fetch(`https://jenikh.github.io/poz_dat/years/${year}/names.json`).then(r => r.json());
        const lenText = await fetch(`https://jenikh.github.io/poz_dat/years/${year}/pic_len.txt`).then(r => r.text());
        const len = Number(lenText.trim());

        function get_pic_url(i) {
            return `https://jenikh.github.io/poz_dat/years/${year}/pic/${i}${end_file}`;
        }

        function randomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function create_img(i) {
            return `<img src="${get_pic_url(i)}" alt="Obrázek ${i}" style="width: 400px; height: auto;">`;
        }

        const d = document.createElement(`div`);
        d.className = `trenazer`;

        const usedPics = new Set();

        for (let i = 1; i <= totalQuestions; i++) {
            let number_pic;
            do {
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

        const input = document.createElement(`input`);
        input.id = `input`;
        input.autocorrect = `off`;
        input.autocapitalize = `off`;
        input.spellcheck = false;
        input.autofocus = true;
        input.autocomplete = `off`;

        const button = document.createElement(`input`);
        button.type = `submit`;
        button.value = `Ověřit`;
        const exit = document.createElement(`input`);
        exit.type = `submit`;
        exit.value = `Konec`;
        exit.onclick = () => {
            setCookie("test_is_running", false, 1);
            goToWeb(`./index.html`);
        }
        document.body.appendChild(exit);
        const inputContainer = document.createElement(`div`);
        inputContainer.id = `input-container`;
        inputContainer.appendChild(input);
        inputContainer.appendChild(document.createElement(`br`));
        inputContainer.appendChild(button);
        document.body.appendChild(inputContainer);

        button.onclick = async () => {
            const active = document.querySelector(`.active`);
            const comment = active.innerHTML.split(`<!--[`)[1]?.split(`]-->`)[0];
            
            const [correctFirst, correctSecond] = comment.split(`,`);
            const answer = input.value.trim().toLowerCase().split(` `);
            console.log(answer);
            console.log(correctFirst);
            console.log(correctSecond);
            let bad_answer_1 = false;
            let bad_answer_2 = false;

            if (answer.length === 1) {
                answer.push(` _g_`);
            } else if (answer.length !== 2) {
                input.value = ``;
                console.log(`Invalid answer`);
                return;
            }

            if (answer[0] === correctFirst.toLowerCase()) {
                score += 1;
            } else {
                bad_answer_1 = true;
            }

            if (answer[1] === correctSecond.toLowerCase()) {
                score += 1;
            } else {
                bad_answer_2 = true;
            }

            if (notifications_bad) {
                if (bad_answer_1 && bad_answer_2) {
                    button.disabled = true;
                    await createAlert(`Nesprávná odpověď (celá)`);
                } else if (bad_answer_1) {
                    button.disabled = true;
                    await createAlert(`Nesprávné první jméno`);
                } else if (bad_answer_2) {
                    button.disabled = true;
                    await createAlert(`Nesprávné druhé jméno`);
                }
            }


            click_button = true;
            active.className = `inactive`;
            active.style.display = `none`;
            currentIndex++;

            if (currentIndex > totalQuestions) {
                await createAlert(`Test hotov! Body: ${score} / ${totalQuestions * 2}`);
                setCookie(`test_is_running`, false, 1);
                if (await createYesNoAlert(`Chcete znovu pustit test?`)) {
                    location.reload();
                } else {
                    goToWeb(`./roky.html`);
                }
            } else {
                button.disabled = false;
                const next = document.getElementById(`box-${currentIndex}`);
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
    if (!click_button) {
        await createAlert(`Pouze po kliknutí na tlačítko s odpovědí`);
        return;
    }
    if (currentIndex > totalQuestions) return;
    currentIndex = totalQuestions + 1;
    await createAlert(`Test hotov! Body: ${score} / ${totalQuestions * 2}`);
    setCookie(`test_is_running`, false, 1);
    if (await createYesNoAlert(`Chcete znovu pustit test?`)) {
        location.reload();
    }
}
console.log(document.readyState);

main(); // If trenazer.js is injected after DOM is ready, this is safe
