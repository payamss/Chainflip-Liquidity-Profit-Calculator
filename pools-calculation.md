# Pool Score Calculation Documentation

This document explains the mathematical model used to calculate the **Pool Score**, which is a measure of the attractiveness of a pool for investment. The score is derived from several key metrics, weighted based on importance.

## Formula for Pool Score

The formula for calculating the score is as follows:

\[
\text{Score} = w_1 \cdot \text{Volume-to-Liquidity Ratio} + w_2 \cdot \text{Fees (24H)} + w_3 \cdot \text{Volume Growth (24H)} - w_4 \cdot \text{Risk Factor}
\]

### Explanation of Terms:
1. **Volume-to-Liquidity Ratio (\(V/L\))**:
   \[
   V/L = \frac{\text{Volume (24H)}}{\text{Deployed Liquidity}}
   \]
   - Higher \(V/L\) ratios indicate more trading activity relative to liquidity, meaning higher fee-earning potential for liquidity providers.

2. **Fees (24H)**:
   - Represents the absolute value of fees generated in the last 24 hours.
   - Higher fees indicate greater returns for liquidity providers.

3. **Volume Growth (24H)**:
   The formula is given by: $\text{Volume Growth (\%)} = \frac{\text{Change in Volume}}{\text{Previous Volume}} \times 100$.
   - Indicates the percentage increase in trading volume over the last 24 hours.
   - Pools with higher volume growth are considered more attractive.

4. **Risk Factor**:
   - Represents the level of risk associated with the pool:
     - Stablecoin pools (e.g., USDC/USDT) are assigned a **lower risk** value (\(0\)).
     - Volatile token pools (e.g., BTC/USDC) are assigned a **higher risk** value (\(1\)).

5. **Weights (\(w_1, w_2, w_3, w_4\))**:
   - The importance of each metric is determined by weights:
     - \(w_1 = 0.4\): Importance of Volume-to-Liquidity Ratio.
     - \(w_2 = 0.3\): Importance of Fees (24H).
     - \(w_3 = 0.2\): Importance of Volume Growth (24H).
     - \(w_4 = 0.1\): Importance of Risk Factor.

---

## Steps to Calculate the Pool Score:

1. **Normalize the Data**:
   - Convert monetary values (e.g., `$1.04M`, `$136.7K`) to plain numbers:
     - `$1.04M` \(\rightarrow\) `1,040,000`
     - `$136.7K` \(\rightarrow\) `136,700`

2. **Calculate Volume-to-Liquidity Ratio**:
   \[
   V/L = \frac{\text{Volume (24H)}}{\text{Deployed Liquidity}}
   \]

3. **Apply Weights to Metrics**:
   - Multiply each metric by its corresponding weight:
     - \(w_1 \cdot V/L\)
     - \(w_2 \cdot \text{Fees (24H)}\)
     - \(w_3 \cdot \text{Volume Growth (24H)}\)
     - \(w_4 \cdot \text{Risk Factor}\)

4. **Compute the Final Score**:
   \[
   \text{Score} = w_1 \cdot V/L + w_2 \cdot \text{Fees (24H)} + w_3 \cdot \text{Volume Growth (24H)} - w_4 \cdot \text{Risk Factor}
   \]

5. **Sort Pools by Score**:
   - Rank the pools in descending order of their scores.

---

## Example Calculation:

### Given Data for a Pool:
| Metric                | Value             |
|-----------------------|-------------------|
| **Deployed Liquidity** | $1,000,000       |
| **Volume (24H)**       | $500,000         |
| **Fees (24H)**         | $1,000           |
| **Volume Growth (24H)**| 20%              |
| **Risk Factor**        | 1 (volatile pool)|

### Step-by-Step Calculation:
1. **Normalize Data**:
   - Deployed Liquidity = \(1,000,000\)
   - Volume (24H) = \(500,000\)
   - Fees (24H) = \(1,000\)

2. **Calculate Volume-to-Liquidity Ratio**:
   \[
   V/L = \frac{500,000}{1,000,000} = 0.5
   \]

3. **Apply Weights**:
   - \(w_1 \cdot V/L = 0.4 \cdot 0.5 = 0.2\)
   - \(w_2 \cdot \text{Fees (24H)} = 0.3 \cdot 1,000 = 300\)
   - \(w_3 \cdot \text{Volume Growth (24H)} = 0.2 \cdot 20 = 4\)
   - \(w_4 \cdot \text{Risk Factor} = 0.1 \cdot 1 = 0.1\)

4. **Compute Final Score**:
   \[
   \text{Score} = 0.2 + 300 + 4 - 0.1 = 304.1
   \]

---

## Updated Table Columns:
To include the **Volume-to-Liquidity Ratio (V/L)** in the table, the columns will be:

| Pool          | Deployed Liquidity | Volume (24H) | Fees (24H) | V/L   | Score  |
|---------------|--------------------|--------------|------------|-------|--------|
| Example Pool  | $1,000,000         | $500,000     | $1,000     | 0.5   | 304.1  |

---

## Notes:
- The weights (\(w_1, w_2, w_3, w_4\)) can be adjusted based on the investor's preferences (e.g., conservative vs. aggressive).
- Pools with higher scores are ranked higher, indicating better investment opportunities.

---
