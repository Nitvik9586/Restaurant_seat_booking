import { Payment, PaymentStatus } from "./payment";

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  RESCHEDULE = "RESCHEDULED"
}

export class Booking {
  private static readonly PRICE_PER_PERSON = 10;
  private static readonly CANCEL_FEE_RATE = 0.10;
  private payment: Payment;
  constructor(
    private customerId: string,
    private id: string,
    private date: string,
    private numOfPerson: number,
    private timeSlot: string,
    private status: BookingStatus = BookingStatus.PENDING,
  ) { this.payment = new Payment(this.numOfPerson * Booking.PRICE_PER_PERSON) }

  public getId(): string {
    return this.id
  }

  public getCustomerId(): string {
    return this.customerId
  }

  public getDate(): string  {
    return this.date;
  }

  public getTimeSlot(): string  {
    return this.timeSlot;
  }

  public getNumOfPerson(): number {
    return this.numOfPerson;
  }

  public checkSameDateAndTime(newDate: string, newTimeSlot: string): boolean {
    return this.date == newDate && this.timeSlot == newTimeSlot;
  }

  public confirm(): boolean {
    console.log(`Proceed to pay ${this.payment.getAmount()}...\n`)
    const isPaymentDone = this.payment.process(this.payment.getAmount());

    if (!isPaymentDone) {
      console.log(`Booking can not be done due to failed payment.\n
  ================================================================\n`);
      return false;
    }

    this.status = BookingStatus.CONFIRMED;

    console.log(`Your booking is confirmed and Booking ID is ${this.id}\n
  ==========================================\n`);
    return true;
  }

  public cancel(): void {

    const cancellationCharge = this.payment.getAmount() * Booking.CANCEL_FEE_RATE;

    const refundAmount = this.payment.getAmount() - cancellationCharge;

    console.log(`Cancelation charges is ${cancellationCharge}.`);
    this.payment.refund(refundAmount)
    this.status = BookingStatus.CANCELLED;


    console.log(`Your booking is cancelled.
        \n==========================================\n`);

  }

  public reschedule(newDate: string, newNumOfPerson: number, newTimeSlot: string): boolean {
    if (this.status == BookingStatus.CANCELLED) {
      console.log("Your Booking is already cancelled You can't reschedule it.\n");
      return false;
    }

    if (this.numOfPerson < newNumOfPerson) {
      const numOfPerson = newNumOfPerson - this.numOfPerson
      const payableAmount = (numOfPerson) * Booking.PRICE_PER_PERSON;
      const totalPayment = newNumOfPerson * Booking.PRICE_PER_PERSON;

      const isPayment = this.payment.process(payableAmount);
      if (!isPayment) return false;
      this.payment.setAmount(totalPayment);
    } else if (this.numOfPerson > newNumOfPerson) {
      const numOfPerson = this.numOfPerson - newNumOfPerson;
      const refundAmount = (numOfPerson) * Booking.PRICE_PER_PERSON;


      this.payment.refund(refundAmount);
      const newAmount = this.payment.getAmount() - refundAmount
      this.payment.setAmount(newAmount)
    }

    this.date = newDate;
    this.numOfPerson = newNumOfPerson;
    this.timeSlot = newTimeSlot;
    this.status = BookingStatus.RESCHEDULE;
    this.payment.setStatus(PaymentStatus.PAID);
    console.log(`Your booking having ID ${this.id} is Reschedulled.\n
  ==========================================\n`);
    return true;

  }
}

