chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extractData") {
    try {
      // Helper function to normalize monetary values
      function normalizeAmount(amount) {
        if (!amount) return 0;
        amount = amount.replace(/[+$,]/g, "").trim(); // Remove $, +, and commas
        if (amount.includes("M")) {
          return parseFloat(amount.replace("M", "")) * 1_000_000;
        } else if (amount.includes("K")) {
          return parseFloat(amount.replace("K", "")) * 1_000;
        }
        return parseFloat(amount); // If no M or K, parse as float
      }

      // Extract Open Orders
      const openOrdersRows = document.querySelectorAll("table:first-of-type tbody tr");
      const openOrdersData = [];
      openOrdersRows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        if (cells.length > 0) {
          openOrdersData.push({
            type: cells[0]?.innerText.trim(),
            assets: cells[1]?.innerText.trim(),
            value: cells[2]?.innerText.trim(),
            earnedFees: cells[4]?.innerText.trim(),
            status: cells[5]?.innerText.trim(),
            created: cells[6]?.innerText.trim(),
          });
        }
      });

      // Extract Pool Data
      const poolRows = document.querySelectorAll("table:last-of-type tbody tr");
      const poolData = [];
      poolRows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        if (cells.length > 0) {
          poolData.push({
            pool: cells[0]?.innerText.trim(),
            lastPrice: cells[1]?.innerText.trim(),
            deployedLiquidity: normalizeAmount(cells[2]?.innerText.trim()),
            volume24h: normalizeAmount(cells[3]?.innerText.trim()),
            fees24h: normalizeAmount(cells[4]?.innerText.trim()),
          });
        }
      });

      sendResponse({ openOrders: openOrdersData, pools: poolData });
    } catch (error) {
      console.error("Error extracting data: ", error);
      sendResponse({ openOrders: [], pools: [] });
    }
  }
});
