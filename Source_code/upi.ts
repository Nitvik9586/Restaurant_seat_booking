import { Payment, PaymentStatus, PaymentType } from "./payment";

export class Upi implements Payment {
    constructor(
        public upiId: string,
        public amount: number = 0,
        public paymentType: PaymentType = PaymentType.UPI,
        public status: PaymentStatus = PaymentStatus.PENDING
    ) {}

    public process(amount: number): boolean {
        const isPaid = Math.random() < 0.9;
        
        if (isPaid) {
            console.log(`Payment of ${amount} is paid by this UPI ID ${this.upiId}.\n`)
            this.status = PaymentStatus.PAID;
        } else {
            console.log(`Payment of ${amount} is failed.\n`)
        }
        return isPaid;
    }

    public refund(refundAmount: number): boolean {
        if (refundAmount < 0) {
            console.log(`\nRefund of ${-refundAmount} is refunded to debit UPI ID ${this.upiId}.\n`);
            this.amount += refundAmount;
            return true;
        }
        console.log(`\nRefund of ${refundAmount} is refunded to debit UPI ID ${this.upiId}.\n`);        
        this.status = PaymentStatus.REFUNDED;
        return true;
    }

}