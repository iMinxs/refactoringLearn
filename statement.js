const plays = require("./plays");
const invoices = require("./invoices");

function statement(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `-------------------------------------\n`;
  result += `Statement for ${invoice.customer}\n`;

  for (let perf of invoice.performances) {
    volumeCredits += volumeCreditsFor(perf);
    //print line for this order
    result += `   ${playFor(perf).name}: ${format(amountFor(perf) / 100)} (${
      perf.audience
    } seats) \n`;
    totalAmount += amountFor(perf);
  }

  result += `Amount owed is ${format(totalAmount / 100)}\n`;
  result += `You earned ${volumeCredits} credits\n`;
  result += `-------------------------------------\n`;

  return result;
}

function amountFor(aPerfomance) {
  let result = 0;

  switch (playFor(aPerfomance).type) {
    case "tragedy":
      result = 40000;
      if (aPerfomance.audience > 30) {
        result += 1000 * (aPerfomance.audience - 30);
      }
      break;
    case "comedy":
      result = 30000;
      if (aPerfomance.audience > 20) {
        result += 10000 + 500 * (aPerfomance.audience - 20);
      }
      result += 300 * aPerfomance.audience;
      break;
    default:
      throw new Error(`unknown type: ${playFor(aPerfomance).type}`);
  }

  return result;
}

function playFor(aPerfomance) {
  return plays[aPerfomance.playID];
}

function volumeCreditsFor(aPerfomance) {
  let result = 0;
  result += Math.max(aPerfomance.audience - 30, 0);
  if ("comedy" === playFor(aPerfomance).type)
    result += Math.floor(aPerfomance.audience / 5);

  return result;
}

function format(aNumber) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(aNumber);
}

//输出
for (let i in invoices) {
  console.log(statement(invoices[i], plays));
}
