module.exports = function calculate(values){
    var amount = 0;
    const breakdown = values.breakdown || {};
    if(breakdown.show === 'Yes'){
        amount += parseFloat((breakdown.principalSum || {}).amount) || 0;
        amount += (breakdown.userDefined || []).reduce((acc, d) => {
            return acc + parseFloat((d || {}).amount) || 0;
        }, 0);
        if(values.interest && values.interest.include){
            amount += parseFloat(values.interest.amount) || 0;
        }
    }
    return {breakdown: {calculatedAmount: amount}};
}