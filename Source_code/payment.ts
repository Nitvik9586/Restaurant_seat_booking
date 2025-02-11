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


export abstract class Payment {
    constructor(
        protected amount: number,
        protected paymentType: PaymentType,
        protected status: PaymentStatus
    ) { }

    public abstract process(amount: number): boolean;

    public abstract refund(refundAmount: number): void;

    protected payAmount(): boolean {
        const paid = [false, true];

        let i = Math.random() < 0.9 ? 1 : 0;
        return paid[1]
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

