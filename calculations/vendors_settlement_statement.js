"strict mode"
/** CV09.js */

module.exports = function calculate(values, deps){
    var moment= deps.moment;

    function annumFees(settlementDate, data){
        var days = 0, sumOfRates = 0;
        if(settlementDate && data){
            var annumRate = parseFloat(data.annumRate) || 0,
                startDateRaw = data.startOfYear;
            if(annumRate && startDateRaw){
                var settleDate = moment(settlementDate, "D MMMM YYYY");
                var startDate = moment(startDateRaw, "D MMMM YYYY");
                if(startDate.isBefore(settleDate)){
                    days = parseInt(moment.duration(settleDate.diff(startDate)).asDays(), 10);
                    var daysInYear = moment.duration(startDate.clone().add('1', 'year').diff(startDate)).asDays();
                    sumOfRates = (annumRate / daysInYear) * days;
                }
            }
        }

        return {days: days, amount: sumOfRates};
    }

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
            var end =  moment(item.endDate, "D MMMM YYYY");
            var periodDays = parseInt(moment.duration(end.diff(start)).asDays(), 10);

            var apportionmentDays = parseInt(moment.duration(settlementDate.diff(start)).asDays(), 10);
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