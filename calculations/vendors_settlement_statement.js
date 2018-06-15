"strict mode"
/** CV09.js */

module.exports = function calculate(values, deps){
    var moment= deps.moment;

    var debits = parseFloat(values.purchaseAmount) || 0;
    var credits = parseFloat(values.depositAmount) || 0;


    var ratesAndApportionments = values.ratesAndApportionments;
    var settlementDate = moment(values.settlementDate, "D MMMM YYYY");
    ratesAndApportionments.map(item => {
        if(item.type === 'rate'){
            debits += parseFloat(item.amount) || 0;
        }
        else{
            var start =  moment(item.startDate, "D MMMM YYYY");
            var end =  start.clone().add('year', 1);

            var periodDays = parseInt(moment.duration(end.diff(start)).asDays(), 10);
            var apportionmentDays = parseInt(moment.duration(settlementDate.diff(start)).asDays(), 10) + 1;
            var periodAmount = parseFloat(item.periodAmount) || 0;
            var perDay = periodAmount / periodDays;
            var amount = perDay * apportionmentDays;
            item.amount = amount;
            item.days = apportionmentDays;
            credits += amount;
        }
    });

    var finalAmount = debits - credits;
    var total = Math.max(debits, credits);

    return {calculatedRatesAndApportionments: ratesAndApportionments, totalReceipts: debits, totalPayments: credits};
}