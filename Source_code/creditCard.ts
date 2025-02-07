import { Payment, PaymentStatus, PaymentType } from "./payment";

export class CreditCard extends Payment {
    constructor(
        amount: number,
        status: PaymentStatus,
        private cardNumber: string,
        private expiryDate: string,
    ) {
        super( PaymentType.CREDITCARD, amount, status,)
    }
    public process(amount: number): boolean {
        console.log(this.amount);
        return true
    }
}