function convertTimestampToDate(timestamp) {
  return new Date(timestamp).toLocaleString();
}

function getColor(item) {
  switch (item?.status) {
    case 'FILLED':
      return 'rgba(18, 183, 106, 1)';

    case 'PARTIAL':
      return 'rgba(109, 109, 109, 1)';

    case 'EXPIRED':
      return 'rgba(109, 109, 109, 1)';

    case 'CANCELLED':
      return 'rgba(109, 109, 109, 1)';

    default:
      return 'black';
  }
}

const getSymbolIndexFromWallet = (wallet, symbol) => {
  var index = -1;
  for (var i = 0; i < wallet.length; ++i) {
    if (wallet[i].symbol == symbol) {
      index = i;
      break;
    }
  }

  return index;
};

async function waitFor(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

function displayNumberUpToNDecimals(string, n) {
  let floatNum = parseFloat(string);

  if (isNaN(floatNum)) {
    return 0;
  }

  return Math.trunc(floatNum * 10 ** n) / 10 ** n;
}

module.exports = {
  convertTimestampToDate,
  getColor,
  getSymbolIndexFromWallet,
  waitFor,
  displayNumberUpToNDecimals,
};
