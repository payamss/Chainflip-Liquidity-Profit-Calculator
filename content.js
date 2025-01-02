chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extractData") {
    try {
      // Open Orders Table
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

      // Pool Table
      const poolRows = document.querySelectorAll("table:last-of-type tbody tr");
      const poolData = [];
      poolRows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        if (cells.length > 0) {
          poolData.push({
            pool: cells[0]?.innerText.trim(),
            deployedLiquidity: cells[2]?.innerText.trim(),
            volume24h: cells[3]?.innerText.trim(),
            fees24h: cells[4]?.innerText.trim(),
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
