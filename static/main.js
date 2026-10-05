async function predict() {

    const title = document.getElementById("title").value;
    const genre = document.getElementById("genre").value;
    const year = document.getElementById("year").value;
    const runtime = document.getElementById("runtime").value;
    const budget = document.getElementById("budget").value;
    const votes = document.getElementById("votes").value;

    if (!genre) {
        alert("Please select a genre.");
        return;
    }

    const data = {
        title: title,
        genre: genre,
        title_year: year,
        duration: runtime,
        budget: budget,
        num_voted_users: votes
    };

    try {

        const response = await fetch("/predict", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (!response.ok || !result.success) {
            alert(result.error || "Prediction failed.");
            return;
        }

        showResult(result, title);

    } catch (error) {

        console.error(error);

        alert("Could not connect to the Flask server.");

    }
}


function showResult(result, title) {

    console.log(result);
    const resultSection = document.getElementById("resultSection");
    const fill = document.getElementById("fill");
    const ratingEl = document.getElementById("rating");
    const resultTitleEl = document.getElementById("resultTitle");
    const resultTextEl = document.getElementById("resultText");
    const badgeEl = document.getElementById("badge");

    resultTitleEl.textContent = title;

    const prediction = Number(result.prediction);
    const confidence = Number(result.confidence || 0);
    const ratingPercent = Math.min(Math.max((prediction / 10) * 100, 0), 100);

    badgeEl.textContent = confidence > 0
        ? `Estimated IMDb rating • ${confidence.toFixed(0)}% confidence`
        : `Estimated IMDb rating`;

    fill.style.transition = "none";
    fill.style.width = "0%";
    void fill.offsetWidth;
    fill.style.transition = "width .7s cubic-bezier(.22, 1, .36, 1)";
    requestAnimationFrame(() => {
        fill.style.width = `${ratingPercent}%`;
    });

    ratingEl.innerHTML =
        `${prediction.toFixed(2)} <span>/ 10</span>`;

    resultTextEl.textContent =
        `This movie is predicted to score about ${prediction.toFixed(2)}/10 on IMDb based on the supplied features.`;

    resultSection.classList.remove("show");
    void resultSection.offsetWidth;
    resultSection.classList.add("show");

    requestAnimationFrame(() => {
        resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
        resultSection.focus({ preventScroll: true });
    });
}