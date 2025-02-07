import { CreditCard } from "./creditCard";

export enum PaymentStatus {
    PENDING = "PENDING",
    PAID = "PAID",
    REFUNDED = "REFUNDED",
}

export enum PaymentType {
    UPI = 'UPI',
    CREDITCARD = 'CreditCard',
    DEBITCARD = 'DebitCard'
}


export class Payment {
    constructor(
        public paymentType: PaymentType,
        public amount: number = 0,
        public status: PaymentStatus = PaymentStatus.PENDING,
    ) { }

    public process(amount: number) {
        const isPaid = this.payAmount()
        if (isPaid) {
            console.log(`Payment of ${amount} is paid.\n`)
            this.status = PaymentStatus.PAID;
        } else {
            console.log(`Payment of ${amount} is failed.\n`)
        }
        return isPaid;
    }

    private payAmount(): boolean {
        const paid = [false, true];

        let i = Math.random() < 0.9 ? 1 : 0;
        return paid[1]
    }

    public refund(refundAmount: number): void {
        console.log(`\nRefund of ${refundAmount} is refunded. `);
        this.status = PaymentStatus.REFUNDED;
    }

    public getAmount(): number {
        return this.amount;
    }

    public setAmount(amount: number): void {
        this.amount = amount;
    }


    public getStatus(): PaymentStatus {
        return this.status;
    }

    public setStatus(status: PaymentStatus): void {
        this.status = status;
    }
}