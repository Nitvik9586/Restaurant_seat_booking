import { CreditCard } from "./creditCard";
import { Customer } from "./customer";
import { Payment, PaymentStatus, PaymentType } from "./payment";
import { Restaurant } from "./restaurant";

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  RESCHEDULE = "RESCHEDULED"
}

export class Booking {
  static bookingCount: number = 0;

  constructor(
    private customer: Customer,
    private restaurant: Restaurant,
    private date: string,
    private numOfSeat: number,
    private timeSlot: string,
    private payment: Payment,
    private id: string = '',
    private status: BookingStatus = BookingStatus.PENDING,
  ) {
  }

  public getId(): string {
    return this.id
  }

  public generateBookingId(): string {
    return `b${++Booking.bookingCount}`;
  }


  public confirm(): void {

    if (this.restaurant.isSeatsAvailable(this.date, this.timeSlot, this.numOfSeat)) {

      console.log(`Booking started by ${this.customer.getName()}...\n`);

      const paymentAmount = this.restaurant.getTotalAmount(this.numOfSeat);

      console.log(`Proceed to pay ${paymentAmount}...\n`)

      if (this.payment.process(paymentAmount)) {
        this.id = this.generateBookingId();
        this.status = BookingStatus.CONFIRMED;

        this.customer.addBooking(this);

        this.restaurant.removeSeatsAvailability(this.date, this.timeSlot, this.numOfSeat);

        console.log(`Your booking is confirmed with Booking ID ${this.id} in ${this.restaurant.getName()} restaurant.\n
===============================================================\n`);

        return;
      }
      console.log('Your booking is not confirmed.');
      return;

    }

    console.log(`Booking can not be done due to failed payment.\n
================================================================\n`);
    return;
  }

  public cancel(): void {
    const refundAmount = this.restaurant.getRefundAmount(this.numOfSeat);

    if (this.payment.refund(refundAmount)) {
      this.status = BookingStatus.CANCELLED;

      this.restaurant.addSeatsAvailability(this.date, this.timeSlot, this.numOfSeat);

      console.log("Your booking is cancelled. \n ");
      return;
    }

    console.log("Your booking cancelation failed due to some issue.\n ");
    return;
  }

  public reschedule(newDate: string, newnumOfSeat: number, newTimeSlot: string): void {

    if (this.status == BookingStatus.CANCELLED) {
      console.log("Cancelled booking can not be rescheduled.\n");
      return;
    }

    const isSameDateTime = (this.date == newDate && this.timeSlot == newTimeSlot) ? true : false;

    if (isSameDateTime) {
      this.restaurant.addSeatsAvailability(newDate, newTimeSlot, this.numOfSeat);
    }

    if (this.restaurant.isSeatsAvailable(newDate, newTimeSlot, newnumOfSeat)) {
      const seatsToReschedule = newnumOfSeat - this.numOfSeat;
      const diffInAmount = this.restaurant.getTotalAmount(seatsToReschedule)

      if (seatsToReschedule > 0) {
        const isPaymentDone = this.payment.process(diffInAmount);

        if (!isPaymentDone) return;

      } else if (seatsToReschedule < 0) {
        this.payment.update(-diffInAmount)
      }

      this.restaurant.removeSeatsAvailability(newDate, newTimeSlot, newnumOfSeat);

      if (!isSameDateTime) {
        this.restaurant.addSeatsAvailability(this.date, this.timeSlot, this.numOfSeat)
      }

      this.date = newDate;
      this.numOfSeat = newnumOfSeat;
      this.timeSlot = newTimeSlot;
      this.status = BookingStatus.RESCHEDULE;

      console.log(`Your booking is Reschedulled.\n
==========================================\n`);
      return;
    }

    if (isSameDateTime) {
      this.restaurant.removeSeatsAvailability(newDate, newTimeSlot, this.numOfSeat);
    }

    console.log('Reschedule is failed.\nPlease re-try.');
  }
}