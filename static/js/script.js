document.addEventListener("DOMContentLoaded", function () {
    const bgText = document.getElementById("bg-text");
    const chars = ["অ", "আ", "ই", "উ", "এ", "ও", "ক", "গ", "চ", "ট", "প", "ব", "ম", "য", "র", "ল", "শ", "স"];

    let placedPositions = [];

    for (let i = 0; i < 40; i++) {
        let span = document.createElement("span");
        span.innerText = chars[Math.floor(Math.random() * chars.length)];

        let top, left, tooClose;
        do {
            top = Math.random() * 90;
            left = Math.random() * 90;

            tooClose = placedPositions.some(pos => {
                let distance = Math.sqrt(Math.pow(pos.top - top, 2) + Math.pow(pos.left - left, 2));
                return distance < 10;
            });
        } while (tooClose);

        placedPositions.push({ top, left });

        span.style.top = top + "vh";
        span.style.left = left + "vw";
        span.style.setProperty("--rotate", Math.random() * 60 - 30 + "deg");
        span.style.fontSize = `${Math.random() * 60 + 15}px`;

        // Random delay for fade-in and fade-out effect
        const randomDelay = Math.random() * 3 + 1;  // Delay between 1 to 4 seconds
        span.style.animationDelay = `${randomDelay}s`;

        bgText.appendChild(span);
    }
});



// function isBanglaText(text) {
//     return /^[\u0980-\u09FF\s]+$/.test(text);
// }

// Function to show custom alert
function showAlert(message) {
    const alertBox = document.getElementById("custom-alert");
    document.getElementById("alert-message").innerText = message;

    alertBox.classList.add("show"); // Show alert with animation
    setTimeout(closeAlert, 3000); // Auto-close after 3 seconds
}

// Function to close custom alert
function closeAlert() {
    const alertBox = document.getElementById("custom-alert");
    alertBox.classList.remove("show");
}


// Function to check sentiment
async function checkSentiment() {
    const userInput = document.getElementById("user-input").value.trim();
    if (!userInput) {
        showAlert("দয়া করে কিছু লিখুন!");
        return;
    }

    // if (!isBanglaText(userInput)) {
    //     showAlert("⚠️ শুধুমাত্র বাংলা লেখা লিখুন!");
    //     return;
    // }

    try {
        const response = await fetch("http://127.0.0.1:8000/analyze/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: userInput }),
        });

        const data = await response.json();
        console.log("Response Data:", data); // Debugging

        // Extract response values
        const sentimentText = data.predicted_sentiment || "Unknown";
        const probabilities = data.sentiment_probabilities || {};

        const negativeScore = probabilities.Negative ? probabilities.Negative.toFixed(2) : 0;
        const neutralScore = probabilities.Neutral ? probabilities.Neutral.toFixed(2) : 0;
        const positiveScore = probabilities.Positive ? probabilities.Positive.toFixed(2) : 0;

        // Bangla translation for sentiments
        const sentimentTranslations = {
            Positive: "ইতিবাচক",
            Negative: "নেতিবাচক",
            Neutral: "নিরপেক্ষ"
        };

        // Update chart and display result with Bangla text
        updateCharts(negativeScore, neutralScore, positiveScore);
        displayResult(
            `মডেলের বিশ্লেষণ: <strong class="${sentimentText.toLowerCase()}-text">${sentimentTranslations[sentimentText] || "অজানা"}</strong>`,
            getColor(sentimentText)
        );


    } catch (error) {
        console.error("Error fetching sentiment:", error);
        displayResult("⚠️ ফলাফল প্রদর্শনে সমস্যা হয়েছে।", "#E74C3C");
    }
}

// Function to update the circular charts
function updateCharts(negative, neutral, positive) {
    document.querySelector(".circular-chart.negative .circle").style.strokeDasharray = `${negative}, 100`;
    document.querySelector(".circular-chart.neutral .circle").style.strokeDasharray = `${neutral}, 100`;
    document.querySelector(".circular-chart.positive .circle").style.strokeDasharray = `${positive}, 100`;

    document.querySelector(".circular-chart.negative .percentage").textContent = `${negative}%`;
    document.querySelector(".circular-chart.neutral .percentage").textContent = `${neutral}%`;
    document.querySelector(".circular-chart.positive .percentage").textContent = `${positive}%`;
}

// Function to display result in the result box
function displayResult(message, color) {
    const resultBar = document.getElementById("result-bar");
    const sentimentOutput = document.getElementById("sentiment-output");

    sentimentOutput.innerHTML = message;
    resultBar.style.background = `rgba(38, 50, 56, 0.9)`;  // Keeping the dark blur background
    resultBar.classList.add("show"); // Show result box
}

// Function to get color based on sentiment
function getColor(sentiment) {
    if (sentiment === "Negative") return "#E74C3C"; // Red
    if (sentiment === "Neutral") return "#F1C40F"; // Yellow
    return "#4CC790"; // Green
}

// Close result box
document.getElementById("close-result").addEventListener("click", function () {
    document.getElementById("result-bar").classList.remove("show");
  });

