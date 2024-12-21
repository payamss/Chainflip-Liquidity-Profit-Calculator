function calculateColorWideRange(apr, minApr, maxApr) {
  // Normalize APR to a scale from -1 to 1 (centered at 0%)
  const normalized = (apr - minApr) / (maxApr - minApr);

  let red, green;

  if (apr < 0) {
    // Negative APR: Red to White
    const negativeNormalized = Math.abs(apr) / Math.abs(minApr);
    red = 255;
    green = Math.floor(negativeNormalized * 255); // Green increases toward white
  } else {
    // Positive APR: White to Green
    const positiveNormalized = apr / maxApr;
    green = 255;
    red = Math.floor(255 - positiveNormalized * 255); // Red decreases toward green
  }

  return `rgba(${red}, ${green}, 255, 0.5)`; // Include 50% opacity
}

document.getElementById("calculateBtn").addEventListener("click", () => {
  const spinner = document.getElementById("spinner");
  const resultsTable = document.getElementById("resultsTable");
  const resultsBody = document.getElementById("results");

  spinner.classList.remove("d-none"); // Show spinner

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: "extractData" },
      (response) => {
        spinner.classList.add("d-none"); // Hide spinner

        if (response) {
          resultsBody.innerHTML = ""; // Clear previous results

          // Determine min and max APR for -500% to +500% range
          const minApr = -500;
          const maxApr = 500;

          response.forEach((data, index) => {
            const value = parseFloat(
              data.value.replace("$", "").replace(",", "")
            );
            const fees = data.fees.split(" / ").reduce((sum, fee) => {
              return sum + parseFloat(fee.replace(/[^0-9.]/g, ""));
            }, 0);

            const apr = ((fees / value) * 365 * 100).toFixed(2); // Annual Percentage Rate
            const mpr = (apr / 12).toFixed(2); // Monthly Percentage Rate
            const dpr = (apr / 365).toFixed(2); // Daily Percentage Rate
            const color = calculateColorWideRange(apr, minApr, maxApr); // Get color with white midpoint

            const row = document.createElement("tr");
            row.innerHTML = `
              <td>${data.type}</td>
              <td>${data.assets
                .split(" ")
                .join("<br>")}</td> <!-- Display assets in two lines -->
              <td>${data.value}</td>
              <td>${dpr}%</td> <!-- DPR -->
              <td>${mpr}%</td> <!-- MPR -->
              <td style="background-color: ${color}; color: black;">${apr}%</td> <!-- APR with color -->
              <td>${data.status}</td>
            `;
            resultsBody.appendChild(row);
          });

          resultsTable.classList.remove("d-none"); // Show results table
        }
      }
    );
  });
});
