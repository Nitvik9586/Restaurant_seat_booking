import { Customer } from "./customer";
import { Payment } from "./payment";
import { Restaurant } from "./restaurant";

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  RESCHEDULE = "RESCHEDULED"
}

export class Booking {
  static bookingIdCount: number = 0;

  constructor(
    public customer: Customer,
    public restaurant: Restaurant,
    private date: string,
    private numOfSeat: number,
    private timeSlot: string,
    private payment: Payment,
    private id: string = '',
    private status: BookingStatus = BookingStatus.PENDING,
  ) { }

  public getId(): string {
    return this.id
  }

  private generateBookingId(): string {
    return `b${++Booking.bookingIdCount}`;
  }

  public confirm(): void {
    console.log(`Booking started by ${this.customer.name}...\n`);
    console.log(`Selected date: ${this.date}\n`);
    console.log(`Selected timeslot: ${this.timeSlot}\n`);
    console.log(`Selected number of seats: ${this.numOfSeat}\n`);

    console.log(`Checking availability...\n...\n...\n`);

    if (this.restaurant.isSeatsAvailable(this.date, this.timeSlot, this.numOfSeat)) {
      const payableAmount = this.restaurant.getTotalAmount(this.numOfSeat);

      console.log(`Total payable amount for ${this.numOfSeat} seat is ${payableAmount}.\n`)

      console.log(`Proceed to pay ${payableAmount}...\n`)

      if (this.payment.process(payableAmount)) {
        this.id = this.generateBookingId();

        this.customer.addBooking(this);

        this.restaurant.removeSeatsAvailability(this.date, this.timeSlot, this.numOfSeat);

        this.status = BookingStatus.CONFIRMED;

        console.log(`Your booking is confirmed with Booking ID ${this.id} in ${this.restaurant.name} restaurant.\n
================================================================\n`);
        return;
      }

      console.log(`Booking can not be done due to failed payment.\n
        ================================================================\n`);
      return;
    }

    console.log('Your booking is not confirmed.\n===============================================================\n');
    return;
  }

  public cancel(): void {
    console.log(`Cancellation started for booking having id ${this.id}\n`);

    const refundAmount = this.restaurant.getRefundAmount(this.numOfSeat);

    if (this.payment.refund(refundAmount)) {
      this.restaurant.addSeatsAvailability(this.date, this.timeSlot, this.numOfSeat);

      this.status = BookingStatus.CANCELLED;
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
        if (!this.payment.process(diffInAmount)) return;
      } else if (seatsToReschedule < 0) {
        this.payment.refund(diffInAmount)
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

  public getDetails(): string {
    return `
    Booking ID: ${this.id}
    Date: ${this.date}
    Timeslot: ${this.timeSlot}
    Seats: ${this.numOfSeat}
    Status: ${this.status}
    Payment Details:
      Payment type: ${this.payment.paymentType}
      Total amount: ${this.payment.amount}
      Payment status: ${this.payment.status}
  `
  }
}