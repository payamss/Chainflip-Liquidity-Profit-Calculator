
/**
 * Fetches real-time prices for the specified cryptocurrencies.
 * @param {string[]} cryptoSymbols - Array of cryptocurrency symbols (e.g., ["usdc", "usdt"]).
 * @returns {Promise<Object>} - A promise that resolves to an object mapping symbols to USD prices.
 */

export function fetchPrice(cryptoSymbols) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { action: "fetchPrices", query: cryptoSymbols.join(",") },
      (response) => {
        if (response.error) {
          reject(response.error);
        } else {
          resolve(response);
        }
      }
    );
  });
}


/**
 * Sums fees using dynamic crypto prices.
 * @param {string} earnedFees - Earned fees in the format "+<amount> <symbol>" (e.g., "+1.5 USDC").
 * @param {string[]} cryptoSymbols - Array of cryptocurrency symbols.
 * @returns {Promise<number>} - Total fees converted to USD.
 */
export async function sumFeesWithDynamicPrices(earnedFees, cryptoSymbols) {
  try {
    const prices = await fetchPrice(cryptoSymbols);
    let totalValueInUSD = 0;

    earnedFees.split("+").forEach((fee) => {
      fee = fee.trim();
      const parts = fee.split(" ");
      if (parts.length === 2) {
        const [amount, symbol] = parts;
        const normalizedSymbol = symbol.toLowerCase();

        if (prices[normalizedSymbol] && prices[normalizedSymbol].usd) {
          totalValueInUSD += parseFloat(amount) * prices[normalizedSymbol].usd;
        } else {
          console.warn(`Price not found for symbol: ${symbol}`);
        }
      } else {
        console.warn(`Invalid fee format: ${fee}`);
      }
    });

    return totalValueInUSD;
  } catch (error) {
    console.error("Error in sumFeesWithDynamicPrices:", error);
    throw error;
  }
}
