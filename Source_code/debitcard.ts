import { Payment, PaymentStatus, PaymentType } from "./payment";

export class DebitCardPayment implements Payment {
    constructor(
        private debitCardNum: string,
        private expiryDate: string,
        private cvv: number,
        private nameOnCard: string,
        public amount: number = 0,
        public paymentType: PaymentType = PaymentType.DEBITCARD,
        public status: PaymentStatus = PaymentStatus.PENDING
    ) { }

    public process(amount: number): boolean {
        const isPaid = Math.random() < 0.9;

        if (isPaid) {
            console.log(`Payment of ${amount} is paid by this debit card NO. ${this.debitCardNum}.\n`)
            this.status = PaymentStatus.PAID;
            this.amount += amount;
        } else {
            console.log(`Payment of ${amount} is failed.\n`)
        }
        return isPaid;
    }

    public refund(refundAmount: number): boolean {
        if (refundAmount < 0) {
            console.log(`\nRefund of ${-refundAmount} is refunded to debit card NO. ${this.debitCardNum}.\n`);
            this.amount += refundAmount;
            return true;
        }
        console.log(`\nRefund of ${refundAmount} is refunded to debit card NO. ${this.debitCardNum}.\n`);
        this.status = PaymentStatus.REFUNDED;
        return true;
    }
}