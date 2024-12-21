// Function to calculate the number of days passed
function calculateDaysPassed(createdDate) {
  const created = new Date(createdDate);
  const now = new Date();
  const diffTime = Math.abs(now - created);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
}

// Function to calculate average DPR
function calculateAverageDPR(totalFees, value, daysPassed) {
  return ((totalFees / value / daysPassed) * 100).toFixed(2); // Daily Percentage Rate
}

// Function to calculate MPR from average DPR
function calculateMPRFromDPR(dpr) {
  return (dpr * 30).toFixed(2); // Monthly Percentage Rate
}

// Function to calculate APR from average DPR
function calculateAPRFromDPR(dpr) {
  return (dpr * 365).toFixed(2); // Annual Percentage Rate
}

// Function to calculate color for wide range of APR
function calculateColorWideRange(apr, minApr, maxApr) {
  const normalized = (apr - minApr) / (maxApr - minApr);

  let red, green;

  if (apr < 0) {
    const negativeNormalized = Math.abs(apr) / Math.abs(minApr);
    red = 255;
    green = Math.floor(negativeNormalized * 255); // Green increases toward white
  } else {
    const positiveNormalized = apr / maxApr;
    green = 255;
    red = Math.floor(255 - positiveNormalized * 255); // Red decreases toward green
  }

  return `rgba(${red}, ${green}, 255, 0.5)`; // Include 50% opacity
}

// Event listener for "Calculate Profits" button
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

          response.forEach((data) => {
            const value = parseFloat(
              data.value.replace("$", "").replace(",", "")
            );
            const fees = data.fees.split(" / ").reduce((sum, fee) => {
              return sum + parseFloat(fee.replace(/[^0-9.]/g, ""));
            }, 0);

            const daysPassed = calculateDaysPassed(data.created); // Calculate days since pool creation
            const avgDpr = calculateAverageDPR(fees, value, daysPassed); // Average DPR
            const mpr = calculateMPRFromDPR(avgDpr); // Calculate MPR
            const apr = calculateAPRFromDPR(avgDpr); // Calculate APR
            const color = calculateColorWideRange(apr, minApr, maxApr); // Get color for APR

            const row = document.createElement("tr");
            row.innerHTML = `
              <td>${data.type}</td>
              <td>${data.assets
                .split(" ")
                .join("<br>")}</td> <!-- Display assets in two lines -->
              <td>${data.value}</td>
              <td>${fees}</td>
              <td>${daysPassed} days</td> <!-- Days passed -->
              <td>${avgDpr}%</td> <!-- Average DPR -->
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
