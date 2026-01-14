(async () => {
    
    console.log(getCookie("test_is_running"));
    const cheat_video = "./nenene.html"
    const year = getParam(`y`);
    const testRunning = getCookie("test_is_running");
    if (testRunning === true || testRunning === "true") {
        // Simulate delay (5000 ms = 5 seconds)
        console.log("Test is already running, redirecting...");
        document.body.innerHTML = "";
        document.head.innerHTML = "";
        window.location.replace(cheat_video);

        return;
    }

    document.getElementById("title").textContent = "Poznávání přírodnin - Odpovědi";
    document.getElementById("style").href = "./trenazer.css";
    document.getElementById("zpet").href = `./year.html?y=${year}`;

    const end_file = ".webp";
    async function fetchContent(url) {
        return await fetch(base_url + url);
    }
    // Fetch JSON
    const f = await (await fetchContent(`years/${year}/names.json`)).json();
        
    const count = Object.keys(f).length;
    const len = Number(count);
    console.log("Total images:", len);

    // Create container
    const d = document.createElement("div");
    d.className = "trenazer";
    d.style.display = "none";

    for (let i = 1; i <= len; i++) {
        // Make sure f is 1-indexed or adjust accordingly
        const [first, second] = f[i];
        console.log(first, second);
        const name_img = first[0].toUpperCase() + first.slice(1) + " " + second[0].toLowerCase() + second.slice(1);

        const p = document.createElement("p");
        p.textContent = `Číslo: ${i}. Je to: ${name_img}!`;

        const img = document.createElement("img");
        img.src = base_url + `years/${year}/pic/${i}${end_file}`;
        img.alt = `Číslo: ${i}. Je to: ${name_img}`;

        d.appendChild(p);
        d.appendChild(img);
    }

    console.log(d);
    document.body.appendChild(d);
    d.style.display = ""; // show it
})();
