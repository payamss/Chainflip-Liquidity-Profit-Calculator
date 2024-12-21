# Liquidity Profit Calculator

Liquidity Profit Calculator is a Chrome extension that calculates liquidity profits on lp.chainflip.io.

## Features

- Extracts data from lp.chainflip.io
- Calculates Daily Percentage Rate (DPR), Monthly Percentage Rate (MPR), and Annual Percentage Rate (APR)
- Displays results in a table format with color-coded APR

## Installation

1. Clone the repository to your local machine:
    ```sh
    git clone https://github.com/payamss/liquidity-profit-calculator.git
    ```

2. Open Chrome and navigate to `chrome://extensions/`.

3. Enable "Developer mode" by toggling the switch in the top right corner.

4. Click on the "Load unpacked" button and select the directory where you cloned the repository.

## Usage

1. Navigate to lp.chainflip.io in your Chrome browser.

2. Click on the Liquidity Profit Calculator extension icon in the Chrome toolbar.

3. Click the "Calculate Profits" button.

4. The extension will extract data from the page, calculate the profits, and display the results in a table format.

## Files

- [manifest.json](http://_vscodecontentref_/0): Contains the extension's metadata and permissions.
- [popup.html](http://_vscodecontentref_/1): The HTML file for the extension's popup.
- [popup.js](http://_vscodecontentref_/2): The JavaScript file for the extension's popup logic.
- [style.css](http://_vscodecontentref_/3): The CSS file for the extension's popup styling.
- [background.js](http://_vscodecontentref_/4): The background script for the extension.
- [content.js](http://_vscodecontentref_/5): The content script that extracts data from lp.chainflip.io.

## Development

To make changes to the extension, edit the files in the repository and reload the extension in Chrome by clicking the "Reload" button on the extension's card in `chrome://extensions/`.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
