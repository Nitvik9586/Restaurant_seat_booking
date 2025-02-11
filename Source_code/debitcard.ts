import { Payment, PaymentStatus, PaymentType } from "./payment";

export class DebitCard extends Payment {
    constructor(
        public debitCardNum: number,
        amount: number = 0,
        paymentType: PaymentType = PaymentType.DEBITCARD,
        status: PaymentStatus = PaymentStatus.PENDING
    ) {
        super(amount, paymentType, status)
    }

    public process(amount: number): boolean {
        const isPaid = super.payAmount();
        if (isPaid) {
            console.log(`Payment of ${amount} is paid by this debit card NO. ${this.debitCardNum}.\n`)
            this.status = PaymentStatus.PAID;
        } else {
            console.log(`Payment of ${amount} is failed.\n`)
        }
        return isPaid;
    }

    public refund(refundAmount: number): void {
        console.log(`\nRefund of ${refundAmount} is refunded to debit card NO. ${this.debitCardNum}.\n`);
        this.status = PaymentStatus.REFUNDED;
    }

}