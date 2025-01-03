document.addEventListener('DOMContentLoaded', function () {
    const year = new Date().getFullYear();
    const footerText = document.getElementById('footerText');
    footerText.textContent = `Liquidity Profit Calculator, by Payam Shariat ${year}`;
  });
  