export default (currency=0) => '\\'+ String(Number(currency)
  .toLocaleString(undefined)
  // .toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
)
