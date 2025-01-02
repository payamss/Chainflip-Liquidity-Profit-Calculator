const API_URL = "https://api.coingecko.com/api/v3/simple/price";

/**
 * Fetches real-time prices for the specified cryptocurrencies.
 * @param {string[]} cryptoSymbols - Array of cryptocurrency symbols (e.g., ["usdc", "usdt"]).
 * @returns {Promise<Object>} - A promise that resolves to an object mapping symbols to USD prices.
 */
export async function fetchPrice(cryptoSymbols) {
  try {
    const query = cryptoSymbols.join(",");
    const response = await fetch(`${API_URL}?ids=${query}&vs_currencies=usd`);
    if (!response.ok) {
      throw new Error("Failed to fetch crypto prices from API.");
    }
    const prices = await response.json();
    return prices;
  } catch (error) {
    console.error("Error in fetchPrice:", error);
    throw error;
  }
}
