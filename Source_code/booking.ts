import { Payment, PaymentStatus } from "./payment";

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELED = "CANCELLED",
  RESCHEDULE = "RESCHEDULED"
}

export class Booking {
  constructor(
    private customerId: string,
    private id: string,
    private date: string,
    private numOfPerson: number,
    private timeSlot: string,
    private status: BookingStatus = BookingStatus.PENDING,
    private payment: Payment = new Payment()
  ) { this.payment = new Payment(this.numOfPerson * 10) }

  public getId(): string {
    return this.id
  }

  getCustomerId() {
    return this.customerId
  }

  getDate() {
    return this.date;
  }

  getTimeSlot() {
    return this.timeSlot;
  }

  getNumOfPerson() {
    return this.numOfPerson;
  }

  checkSameDateAndTime(bookingDate: string, timeSlot: string): boolean {
    if (this.date == bookingDate && this.timeSlot == timeSlot) {
      return true;
    }
    return false;
  }

  public confirm(): boolean  {
    console.log(`Proceed to pay ${this.payment.getAmount()}...\n`)
    const isPaymentDone = this.payment.process(this.payment.getAmount());

    if (!isPaymentDone) {
      console.log(`Booking can not be done due to failed payment.\n
================================================================\n`);
      return false;
    }

    this.status = BookingStatus.CONFIRMED;
    //   customerId: this.customerId,
    //   id: this.id,
    //   date: this.date,
    //   numOfPerson: this.numOfPerson,
    //   timeSlot: this.timeSlot,
    //   status: this.status,
    //   payment: this.payment,
    // };

    console.log(`Your booking is confirmed and Booking ID is ${this.id}\n
==========================================\n`);
return true;
  }

  public cancel(): void {

    const cancelationCharge = this.payment.getAmount() / 10;

    const refundAmount = this.payment.getAmount() - cancelationCharge;

    console.log(`Cancelation charges is ${cancelationCharge}.`);
    this.payment.refund(refundAmount)
    this.status = BookingStatus.CANCELED;
    

    console.log(`Your booking is cancelled.
      \n==========================================\n`);

  }

  public reschedule(bookingDate: string, numOfPerson: number, timeSlot: string): boolean  {
    if (this.status == "CANCELLED") {
      console.log("Your Booking is already cancelled You can't reschedule it.\n");
      return false;
    }

    if (this.numOfPerson < numOfPerson) {
      const newNumOfPerson = numOfPerson - this.numOfPerson
      const payableAmount = (newNumOfPerson) * 10;
      const totalPayment = numOfPerson * 10;

      const isPayment = this.payment.process(payableAmount);
      if (!isPayment) return false;
      this.payment.setAmount(totalPayment);
    } else if (this.numOfPerson > numOfPerson) {
      const newNumOfPerson = this.numOfPerson - numOfPerson;
      const refundAmount = (newNumOfPerson) * 10;


      this.payment.refund(refundAmount);
      const newAmount = this.payment.getAmount() - refundAmount
      this.payment.setAmount(newAmount)
    }
    
    this.status = BookingStatus.RESCHEDULE;
    this.payment.setStatus(PaymentStatus.PAID)
    console.log(`Your booking having ID ${this.id} is Reschedulled.\n
==========================================\n`);
return true;

  }
}

