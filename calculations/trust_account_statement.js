/** CV10.js */

module.exports = function calculate(values){
    var credits = 0, debits = 0;
    if(values.matter && values.matter.conveyancing){
        if(values.matter.conveyancing.matterType === 'purchase'){
            if(values.matter.conveyancing.loanAdvance) credits += parseFloat(values.matter.conveyancing.loanAdvance.credit) || 0;
            credits += (values.matter.conveyancing.clients || []).reduce((acc, client) => {
                if(client.kiwiSaverWithdrawal) acc += parseFloat(client.kiwiSaverWithdrawal.credit || 0);
                if(client.kiwiSaverHomeStart) acc += parseFloat(client.kiwiSaverHomeStart.credit || 0);
                return acc;
            }, 0);
            if(values.matter.conveyancing.balancePurchasePrice) debits += parseFloat(values.matter.conveyancing.balancePurchasePrice.debits) || 0;
        }
        else if(values.matter.conveyancing.matterType === 'sale'){
            if(values.matter.conveyancing.balancePurchasePrice) credits += parseFloat(values.matter.conveyancing.balancePurchasePrice.credit) || 0;
            if(values.matter.conveyancing.deposit) credits += parseFloat(values.matter.conveyancing.deposit.credit) || 0;
            if(values.conveyancing.repaymentOfIndebtedness) debits += parseFloat(values.conveyancing.matter.repaymentOfIndebtedness.debit) || 0;
        }
        else{
            if(values.matter.loanAdvance) credits += parseFloat(values.matter.loanAdvance.credit) || 0;
            if(values.matter.repaymentOfIndebtedness) debits += parseFloat(values.matter.repaymentOfIndebtedness.debit) || 0;
        }
        if(values.paidByTrust && values.paidByTrust.paidByTrust == "Yes"){
            debits += values.paidByTrust.debit;
        }
        debits += (values.debits || []).reduce((acc, debit) => {
            return acc + parseFloat(debit.debit) || 0;
        }, 0);
        credits += (values.credits || []).reduce((acc, credit) => {
            return acc + parseFloat(credit.credit) || 0;
        }, 0);
    }
    return {totalDebits: debits, totalCredits: credits};
}