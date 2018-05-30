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

    var ratesObj = (values.settlementStatement && values.settlementStatement.rates) || {};
    var leviesObj = (values.settlementStatement && values.settlementStatement.levies) || {};
    var rates = annumFees(values.settlementDate, ratesObj);
    var levies = annumFees(values.settlementDate, leviesObj);
    var debits = values.purchaseAmount || 0;
    var credits = values.depositAmount || 0;

    if(ratesObj.instalmentsPaid && !ratesObj.instalmentsPaid.paid){
        credits += parseFloat(rates.amount) || 0;
        debits += parseFloat(ratesObj.instalmentsPaid.totalAmountInstalments) || 0;
    }
    else if(ratesObj.instalmentsPaid && ratesObj.instalmentsPaid.paid){
        debits += parseFloat(rates.amount) || 0;
    }

    if(leviesObj.include){
        if(leviesObj.instalmentsPaid && !leviesObj.instalmentsPaid.paid){
            credits += parseFloat(levies.amount);
            debits += parseFloat(leviesObj.instalmentsPaid.totalAmountInstalments) || 0;
        }
        else if(leviesObj.instalmentsPaid && leviesObj.instalmentsPaid.paid){
            debits += parseFloat(levies.amount) || 0;
        }
    }




    return {settlementStatement: {
        rates: rates,
        levies: levies,
        totalDebits: debits,
        totalCredits: credits,
        totalAmount: debits - credits
    }};
}