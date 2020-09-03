import getCurrency from "./getCurrency";

export default (invoices=[]) => getCurrency(invoices.map(invoice => invoice.RPZ5CREDITAT)
                                                   .reduce((prev, curr) => prev + curr))
