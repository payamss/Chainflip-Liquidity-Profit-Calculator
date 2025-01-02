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

// Function to calculate MPR and APR from DPR
function calculateMPRFromDPR(dpr) {
  return (dpr * 30).toFixed(2); // Monthly Percentage Rate
}
function calculateAPRFromDPR(dpr) {
  return (dpr * 365).toFixed(2); // Annual Percentage Rate
}

// Function to calculate scores based on weighted formula
function calculateScore(volume, liquidity, fees, growth, risk) {
  const w1 = 0.4, w2 = 0.3, w3 = 0.2, w4 = 0.1;
  const volumeToLiquidity = volume / liquidity;
  return (
    w1 * volumeToLiquidity +
    w2 * fees +
    w3 * growth -
    w4 * risk
  ).toFixed(2);
}

// Event listener for "Calculate Open Orders" button
document.getElementById("calculateOpenOrdersBtn").addEventListener("click", () => {
  const spinnerOrders = document.getElementById("spinnerOrders");
  const openOrdersTable = document.getElementById("openOrdersTable");
  const openOrdersBody = document.getElementById("openOrders");

  spinnerOrders.classList.remove("d-none"); // Show spinner

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: "extractData" },
      (response) => {
        spinnerOrders.classList.add("d-none"); // Hide spinner

        if (response && response.openOrders) {
          openOrdersBody.innerHTML = ""; // Clear previous data

          response.openOrders.forEach((order) => {
            if (order.type.toLowerCase() === "range") {
              const daysPassed = calculateDaysPassed(order.created);
              const totalFees = parseFloat(order.earnedFees.replace(/[$,]/g, ""));
              const value = parseFloat(order.value.replace(/[$,]/g, ""));
              const dpr = calculateAverageDPR(totalFees, value, daysPassed);
              const mpr = calculateMPRFromDPR(dpr);
              const apr = calculateAPRFromDPR(dpr);

              const row = document.createElement("tr");
              row.innerHTML = `
                <td>${order.type}</td>
                <td>${order.assets}</td>
                <td>${order.value}</td>
                <td>${order.earnedFees}</td>
                <td>${daysPassed} days</td>
                <td>${dpr}%</td>
                <td>${mpr}%</td>
                <td>${apr}%</td>
                <td>${order.status}</td>
              `;
              openOrdersBody.appendChild(row);
            }
          });

          openOrdersTable.classList.remove("d-none"); // Show table
        } else {
          console.error("No data for Open Orders.");
        }
      }
    );
  });
});

// Event listener for "Calculate Pools" button
document.getElementById("calculatePoolsBtn").addEventListener("click", () => {
  const spinnerPools = document.getElementById("spinnerPools");
  const poolsTable = document.getElementById("poolsTable");
  const rankingsBody = document.getElementById("rankings");

  spinnerPools.classList.remove("d-none"); // Show spinner

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: "extractData" },
      (response) => {
        spinnerPools.classList.add("d-none"); // Hide spinner

        if (response && response.pools) {
          rankingsBody.innerHTML = ""; // Clear previous data

          const rankedPools = response.pools.map((data) => {
            const liquidity = parseFloat(data.deployedLiquidity.replace(/[$,]/g, ""));
            const volume = parseFloat(data.volume24h.replace(/[$,]/g, ""));
            const fees = parseFloat(data.fees24h.replace(/[$,]/g, ""));
            const growth = parseFloat(data.growth || "0"); // Handle missing growth
            const risk = data.pool.includes("USDC") || data.pool.includes("Stablecoin") ? 0 : 1;

            return {
              pool: data.pool,
              liquidity,
              volume,
              fees,
              score: calculateScore(volume, liquidity, fees, growth, risk),
            };
          });

          // Sort pools by score in descending order
          rankedPools.sort((a, b) => b.score - a.score);

          rankedPools.forEach((pool) => {
            const row = document.createElement("tr");
            row.innerHTML = `
              <td>${pool.pool}</td>
              <td>${pool.liquidity.toLocaleString()}</td>
              <td>${pool.volume.toLocaleString()}</td>
              <td>${pool.fees.toLocaleString()}</td>
              <td>${pool.score}</td>
            `;
            rankingsBody.appendChild(row);
          });

          poolsTable.classList.remove("d-none"); // Show table
        } else {
          console.error("No data for Pools.");
        }
      }
    );
  });
});
