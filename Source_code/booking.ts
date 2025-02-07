import { Payment, PaymentStatus } from "./payment";

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  RESCHEDULE = "RESCHEDULED"
}

export class Booking {
  private static readonly PRICE_PER_SEAT = 10;
  private static readonly CANCEL_FEE_RATE = 0.10;

  private payment: Payment;
  constructor(
    private customerId: string,
    private id: string,
    private date: string,
    private numOfSeat: number,
    private timeSlot: string,
    private status: BookingStatus = BookingStatus.PENDING,
  ) {
    this.payment = new Payment(this.numOfSeat * Booking.PRICE_PER_SEAT)
  }

  public getId(): string {
    return this.id
  }

  public getDate(): string {
    return this.date;
  }

  public getTimeSlot(): string {
    return this.timeSlot;
  }

  public getnumOfSeat(): number {
    return this.numOfSeat;
  }

  public getStatus(): BookingStatus {
    return this.status;
  }

  public checkSameDateAndTime(newDate: string, newTimeSlot: string): boolean {
    return this.date == newDate && this.timeSlot == newTimeSlot;
  }

  public confirm(): void {
    console.log(`Proceed to pay ${this.payment.getAmount()}...\n`)

    this.payment.process(this.payment.getAmount());

    if (this.payment.getStatus() == PaymentStatus.PAID) {
      this.status = BookingStatus.CONFIRMED;

      console.log(`Your booking is confirmed and Booking ID is ${this.id}.\n`);
      return;
    }

    console.log(`Booking can not be done due to failed payment.\n
      ================================================================\n`);
    return;
  }

  public cancel(): void {

    const cancellationCharge = this.payment.getAmount() * Booking.CANCEL_FEE_RATE;

    const refundAmount = this.payment.getAmount() - cancellationCharge;

    console.log(`Cancelation charges is ${cancellationCharge}.`);

    this.payment.refund(refundAmount);

    if (this.payment.getStatus() == PaymentStatus.REFUNDED) {
      this.status = BookingStatus.CANCELLED;

      console.log(`Your booking is cancelled.
          \n==========================================\n`);
    }


  }

  public reschedule(newDate: string, newnumOfSeat: number, newTimeSlot: string): void {
    const seatsToReschedule: number = newnumOfSeat - this.numOfSeat;
    const diffInAmount = (seatsToReschedule) * Booking.PRICE_PER_SEAT;
    
    let totalAmount = this.payment.getAmount();
    if (seatsToReschedule > 0) {
      const isPaymentDone = this.payment.process(diffInAmount);

      if (!isPaymentDone) return;

      totalAmount = newnumOfSeat * Booking.PRICE_PER_SEAT;
    } else if (seatsToReschedule < 0) {
      this.payment.refund(-diffInAmount);

      totalAmount = this.payment.getAmount() + diffInAmount;
      this.payment.setStatus(PaymentStatus.PAID);
    }
    
    this.date = newDate;
    this.numOfSeat = newnumOfSeat;
    this.timeSlot = newTimeSlot;
    this.payment.setAmount(totalAmount);
    this.status = BookingStatus.RESCHEDULE;

    console.log(`Your booking is Reschedulled.\n
==========================================\n`);
  }
}

