export function amountFormat(amount) {
  if (amount < 1000) {
      return `$${amount}`;
  } else if (amount < 1_000_000) {
      return `$${(amount / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  } else {
      return `$${(amount / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  }
}