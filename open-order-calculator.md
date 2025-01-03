# Open Orders Calculation Documentation

This document provides an explanation of how the **Open Orders** data is processed and how key metrics such as **Daily Percentage Rate (DPR)**, **Monthly Percentage Rate (MPR)**, and **Annual Percentage Rate (APR)** are calculated. The document also explains the logic for handling earned fees when multiple coin types are involved.

---

## Key Metrics Calculated

1. **Days Passed**:
   - Represents the number of days since the order was created.
   - Formula:
     \[
     \text{Days Passed} = \text{Current Date} - \text{Created Date}
     \]

2. **Daily Percentage Rate (DPR)**:
   - Measures the daily return based on earned fees and order value.
   - Formula:
     \[
     \text{DPR} = \left( \frac{\text{Total Earned Fees}}{\text{Order Value} \times \text{Days Passed}} \right) \times 100
     \]

3. **Monthly Percentage Rate (MPR)**:
   - Represents the estimated return over 30 days based on DPR.
   - Formula:
     \[
     \text{MPR} = \text{DPR} \times 30
     \]

4. **Annual Percentage Rate (APR)**:
   - Represents the estimated return over 365 days based on DPR.
   - Formula:
     \[
     \text{APR} = \text{DPR} \times 365
     \]

---

## Handling Earned Fees

Earned fees may be denominated in multiple coins (e.g., USDC, USDT). To ensure accurate calculations, the following rules are applied:

1. **Summing Fees for the Same Coin Type**:
   - Fees for USDC and USDT are treated as the same currency and are summed together.
   - Example:
     - Earned Fees: `+1.338906 USDC +1.306825 USDT`
     - Total Fees: \(1.338906 + 1.306825 = 2.645731\)

2. **Ignoring Other Currencies**:
   - Fees in other currencies (e.g., BTC, ETH) are ignored for DPR calculations.

3. **Parsing Fees**:
   - The `sumFeesForSameCoin` function extracts numeric values and sums them based on coin type:
     ```javascript
     function sumFeesForSameCoin(earnedFees) {
       let totalUSDC = 0;
       let totalUSDT = 0;

       earnedFees.split("+").forEach((fee) => {
         fee = fee.trim();
         if (fee.endsWith("USDC") || fee.endsWith("USDT")) {
           const value = parseFloat(fee.replace(/[^0-9.-]+/g, "")); // Extract numeric value
           if (fee.endsWith("USDC")) totalUSDC += value;
           if (fee.endsWith("USDT")) totalUSDT += value;
         }
       });

       return totalUSDC + totalUSDT;
     }
     ```

---

## Example Calculation

### Given Data:
| Metric         | Value                   |
|----------------|-------------------------|
| **Earned Fees**| `+1.338906 USDC +1.306825 USDT` |
| **Order Value**| $182.59                |
| **Created Date**| 12/25/2024            |
| **Current Date**| 01/02/2025            |

### Step-by-Step Calculation:

1. **Calculate Days Passed**:
   \[
   \text{Days Passed} = \text{01/02/2025} - \text{12/25/2024} = 9 \text{ days}
   \]

2. **Calculate Total Earned Fees**:
   \[
   \text{Total Fees} = 1.338906 + 1.306825 = 2.645731 \text{ USDC}
   \]

3. **Calculate DPR**:
   \[
   \text{DPR} = \left( \frac{2.645731}{182.59 \times 9} \right) \times 100 \approx 0.16 \%
   \]

4. **Calculate MPR**:
   \[
   \text{MPR} = 0.16 \times 30 = 4.80 \%
   \]

5. **Calculate APR**:
   \[
   \text{APR} = 0.16 \times 365 = 58.40 \%
   \]

---

## Notes:
- USDC and USDT are treated as equivalent for calculations.
- If no USDC or USDT is present in the earned fees, DPR is calculated as \(0\).
- Fees in other currencies are ignored to avoid conversion complexities.
- **Days Passed** must be greater than zero to avoid division errors.

---

## Updated Table Columns
The Open Orders table now includes the following columns:

| Type   | Assets               | Value   | Earned Fees         | Duration | DPR   | MPR   | APR   | Status   |
|--------|----------------------|---------|---------------------|----------|-------|-------|-------|----------|
| Range  | 60.865148 USDC ...  | $182.59 | +1.338906 USDC ... | 9 days   | 0.16% | 4.80% | 58.40%| In range |

---

Let me know if further refinements are needed!
