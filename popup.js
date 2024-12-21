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

          response.forEach((data, index) => {
            const value = parseFloat(
              data.value.replace("$", "").replace(",", "")
            );
            const fees = data.fees.split(" / ").reduce((sum, fee) => {
              return sum + parseFloat(fee.replace(/[^0-9.]/g, ""));
            }, 0);

            const createdDate = new Date(data.created); // Parse creation time
            const currentTime = new Date();
            const hoursElapsed =
              Math.abs(currentTime - createdDate) / (1000 * 60 * 60); // Hours elapsed

            let dpr, mpr, apr;
            if (hoursElapsed >= 24) {
              // For pools older than a day
              dpr = ((fees / value) * 100).toFixed(2);
            } else {
              // For pools less than a day, annualize fees
              dpr = ((fees / value) * (24 / hoursElapsed) * 100).toFixed(2);
            }

            mpr = (dpr * 30).toFixed(2); // Monthly Percentage Rate
            apr = (dpr * 365).toFixed(2); // Annual Percentage Rate

            const row = document.createElement("tr");
            row.innerHTML = `
              <td>${data.type}</td>
              <td>${data.assets
                .split(" ")
                .join("<br>")}</td> <!-- Display assets in two lines -->
              <td>${data.value}</td>
              <td>${dpr}%</td> <!-- DPR -->
              <td>${mpr}%</td> <!-- MPR -->
              <td>${apr}%</td> <!-- APR -->
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
