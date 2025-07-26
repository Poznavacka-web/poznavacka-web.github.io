(async () => {
    console.log(getCookie("test_is_running"));
    const year = getParam(`y`);
    const testRunning = getCookie("test_is_running");
    if (testRunning === true || testRunning === "true") {
        // Simulate delay (5000 ms = 5 seconds)
        console.log("Test is already running, redirecting...");
        await new Promise(resolve => setTimeout(resolve, 5000));
        document.body.innerHTML = "";
        document.head.innerHTML = "";
        document.body.innerHTML = '<meta http-equiv="refresh" content="0;url=https://youtu.be/_VDvpyTl4dE">';

        return;
    }

    document.getElementById("title").textContent = "Poznávačka - Odpovědi";
    document.getElementById("style").href = "./trenazer.css";

    const end_file = ".png";

    // Fetch JSON
    const f = await fetch(`https://jenikh.github.io/poz_dat/years/${year}/names.json`)
        .then(r => r.json());
    console.log(f);

    // Fetch total image count
    const lenText = await fetch(`https://jenikh.github.io/poz_dat/years/${year}/pic_len.txt`)
        .then(r => r.text());

    const len = Number(lenText.trim());
    console.log("Total images:", len);

    // Create container
    const d = document.createElement("div");
    d.className = "trenazer";
    d.style.display = "none";

    for (let i = 1; i <= len; i++) {
        // Make sure f is 1-indexed or adjust accordingly
        const [first, second] = f[i];
        const name_img = first[0].toUpperCase() + first.slice(1) + " " + second[0].toUpperCase() + second.slice(1);

        const p = document.createElement("p");
        p.textContent = `Číslo: ${i}. Je to: ${name_img}!`;

        const img = document.createElement("img");
        img.src = `https://jenikh.github.io/poz_dat/years/${year}/pic/${i}${end_file}`;
        img.alt = `Číslo: ${i}. Je to: ${name_img}`;

        d.appendChild(p);
        d.appendChild(img);
    }

    console.log(d);
    document.body.appendChild(d);
    d.style.display = ""; // show it
})();
