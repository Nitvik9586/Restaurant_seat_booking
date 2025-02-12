import { Payment, PaymentStatus, PaymentType } from "./payment";

export class CreditCardPayment implements Payment {
    constructor(
        private creditCardNum: string,
        private expiryDate: string,
        private cvv: number,
        private nameOnCard: string,
        public amount: number = 0,
        public paymentType: PaymentType = PaymentType.CREDITCARD,
        public status: PaymentStatus = PaymentStatus.PENDING
    ) { }

    public process(amount: number): boolean {
        const isPaid = Math.random() < 0.9;

        if (isPaid) {
            console.log(`Payment of ${amount} is paid by credit card NO. ${this.creditCardNum}.\n`)
            this.status = PaymentStatus.PAID;
            this.amount += amount;
        } else {
            console.log(`Payment of ${amount} is failed.\n`)
        }
        return isPaid;
    }

    public refund(refundAmount: number): boolean {
        if (refundAmount < 0) {
            console.log(`\nRefund of ${-refundAmount} is refunded to credit card NO. ${this.creditCardNum}.\n`);
            this.amount += refundAmount;
            return true;
        }
        console.log(`\nRefund of ${refundAmount} is refunded to credit card NO. ${this.creditCardNum}.\n`);
        this.status = PaymentStatus.REFUNDED;
        return true;
    }

}
