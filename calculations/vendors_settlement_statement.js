"strict mode"
/** CV09.js */

module.exports = function calculate(values, deps){
    var moment= deps.moment;
    var currency = deps.currency;
    var debits = currency(values.purchaseAmount || 0);
    var credits = currency(values.depositAmount || 0);


    var ratesAndApportionments = values.ratesAndApportionments;
    var settlementDate = moment(values.settlementDate, "D MMMM YYYY");
    ratesAndApportionments.map(item => {
        if(item.type === 'rate'){
            debits = debits.add(currency(item.amount || 0));
        }
        else{
            var start =  moment(item.startDate, "D MMMM YYYY");
            var end =  start.clone().add(1, 'year');

            var periodDays = parseInt(moment.duration(end.diff(start)).asDays(), 10);
            var apportionmentDays = parseInt(moment.duration(settlementDate.diff(start)).asDays(), 10) + 1;
            var periodAmount = currency(item.periodAmount || 0);
            var perDay = periodAmount.divide(periodDays)
            var amount = perDay.multiply(apportionmentDays);
            item.amount = amount;
            item.days = apportionmentDays;
            credits = credits.add(amount);
        }
    });

    var finalAmount = debits.subtract(credits);


    return {calculatedRatesAndApportionments: ratesAndApportionments, totalReceipts: debits, totalPayments: credits};
}