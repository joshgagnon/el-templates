/** CV10.js */

module.exports = function calculate(values){
    var receipts = 0, payments = 0;


    payments += (values.payments || []).reduce((acc, debit) => {
        return acc + parseFloat(debit.amount) || 0;
    }, 0);
    receipts += (values.receipts || []).reduce((acc, credit) => {
        return acc + parseFloat(credit.amount) || 0;
    }, 0);

    return {totalPayments: payments, totalReceipts: receipts};
}