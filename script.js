document.getElementById("uploadForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const fileInput = document.getElementById("fileInput");
    if (!fileInput.files.length) {
        alert("Please select a file!");
        return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    try {
        const response = await fetch("/upload", {
            method: "POST",
            body: formData
        });

        const data = await response.json();
        document.getElementById("result").textContent = `Prediction: ${data.prediction}`;

        // Refresh history
        loadHistory();
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("result").textContent = "Error making prediction.";
    }
});

// Load session history
async function loadHistory() {
    try {
        const response = await fetch("/history");
        const data = await response.json();
        const historyList = document.getElementById("history");
        historyList.innerHTML = "";

        data.history.forEach(item => {
            const li = document.createElement("li");
            li.className = "list-group-item";
            li.textContent = `File: ${item.filename} - Prediction: ${item.prediction}`;
            historyList.appendChild(li);
        });
    } catch (error) {
        console.error("Error loading history:", error);
    }
}

// Load history when page loads
window.onload = loadHistory;
