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
    document.getElementById("resultTitle").textContent = title;

    const prediction = Number(result.prediction);
    const confidence = Number(result.confidence || 0);

    document.getElementById("badge").textContent =
        `Estimated IMDb rating`;

    document.getElementById("fill").style.width =
        `${Math.min(Math.max((prediction / 10) * 100, 0), 100)}%`;

    document.getElementById("rating").innerHTML =
        `${prediction.toFixed(2)} <span>/ 10</span>`;

    document.getElementById("resultText").textContent =
        `This movie is predicted to score about ${prediction.toFixed(2)}/10 on IMDb based on the supplied features.`;

    document.getElementById("resultSection").classList.add("show");
}