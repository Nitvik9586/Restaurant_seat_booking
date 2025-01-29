export enum PaymentStatus {
    PENDING = "PENDING",
    PAID = "PAID",
    REFUNDED = "REFUNDED",
}

export type PaymentDetail = {
    amount: number,
    status: PaymentStatus
}

export class Payment {
    constructor(
        private amount: number = 0,
        private status: PaymentStatus = PaymentStatus.PENDING
    ) { }

    public process(): boolean {
        const isPaid = this.payAmount();
        if(isPaid){
            console.log(`Payment of ${this.amount} is paid.\n`)
            this.status = PaymentStatus.PAID;
        } else {
            console.log(`Payment of ${this.amount} is failed.\n`)
        }
        return isPaid;
    }

    private payAmount(): boolean{
        const paid = [false, true];

        let i = Math.random() < 0.9 ? 1:0;
        return paid[i]
    }

    public refund(): void{
        console.log(`Refund of ${this.amount} is refunded.`);
        this.status = PaymentStatus.REFUNDED;
    }

    public getAmount(): number {
        return this.amount;
    }

    public getStatus(): PaymentStatus {
        return this.status;
    }
}