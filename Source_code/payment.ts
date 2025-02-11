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


export interface Payment {
    amount: number;
    paymentType: PaymentType;
    status: PaymentStatus;
    
    process(amount: number): boolean;
    refund(refundAmount: number): boolean;
    update(amount: number): void;
}
