import { Payment, PaymentStatus, PaymentType } from "./payment";

export class CreditCard extends Payment{
    constructor(public creditCardNum:number,amount:number=0,paymentType:PaymentType= PaymentType.CREDITCARD,status:PaymentStatus= PaymentStatus.PENDING){
        super(amount,paymentType,status)
    }

    public process(amount: number): boolean {
        const isPaid = super.payAmount();
        if (isPaid) {
            console.log(`Payment of ${amount} is paid by this credit card NO. ${this.creditCardNum}.\n`)
            this.status = PaymentStatus.PAID;
        } else {
            console.log(`Payment of ${amount} is failed.\n`)
        }
        return isPaid;
    }

    public refund(refundAmount: number): void {
        console.log(`\nRefund of ${refundAmount} is refunded to credit card NO. ${this.creditCardNum}.\n`);
        this.status = PaymentStatus.REFUNDED;
    }
    
}