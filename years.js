async function loadYears() {
    async function fetch_content(url) {
        try {
            const response = await fetch("https://jenikh.github.io/poz_dat/" + url);
            return await response.json();
        } catch (e) {
            console.error("Chyba při načítání nebo parsování JSON:", e);
            return null;
        }
    }

    const data = await fetch_content("years.json");
    const names = await fetch_content("names.json");

    if (!data || !Array.isArray(data.years) || !names) {
        console.error("Neplatná data:", data, names);
        return;
    }

    const contentContainer = document.getElementById('content-roky');
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';

    data.years.forEach(yearStr => {
        let year_nm;

        const year = Number(yearStr);
        if (isNaN(year)) {
            year_nm = yearStr;
        } else {
            year_nm = year;
        }

        const button = document.createElement("button");
        const label = names[yearStr] || `${year}/${year + 1}`;

        button.textContent = label;
        button.addEventListener("click", () => {
            window.location.href = `./year.html?y=${year_nm}`;
        });

        buttonContainer.appendChild(button);
    });

    contentContainer.appendChild(buttonContainer);
}

loadYears();
