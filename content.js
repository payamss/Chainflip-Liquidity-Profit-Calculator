chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extractData") {
    const rows = document.querySelectorAll("tbody tr");
    const data = [];

    rows.forEach((row) => {
      const cells = row.querySelectorAll("td");
      if (cells.length > 0) {
        data.push({
          type: cells[0].innerText,
          assets: cells[1].innerText,
          value: cells[2].innerText,
          priceRange: cells[3].innerText,
          fees: cells[4].innerText,
          status: cells[5].innerText,
          created: cells[6].innerText,
        });
      }
    });

    sendResponse(data);
  }
});
