import { Payment, PaymentStatus, PaymentType } from "./payment";

export class Upi extends Payment{
    constructor(public upiId:string,amount:number=0,paymentType:PaymentType= PaymentType.UPI,status:PaymentStatus= PaymentStatus.PENDING){
        super(amount,paymentType,status)
    }

    public process(amount: number): boolean {
        const isPaid = super.payAmount();
        if (isPaid) {
            console.log(`Payment of ${amount} is paid by this UPI ID ${this.upiId}.\n`)
            this.status = PaymentStatus.PAID;
        } else {
            console.log(`Payment of ${amount} is failed.\n`)
        }
        return isPaid;
    }
    
}