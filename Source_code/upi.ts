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
        console.log(`\nRefund of ${refundAmount} is refunded to UPI ID ${this.upiId}.\n`);
        this.status = PaymentStatus.REFUNDED;
        return true;
    }

    public update(amount: number): void {
        this.refund(amount)
        this.status = PaymentStatus.PAID;
        this.amount -= amount;
    }

}