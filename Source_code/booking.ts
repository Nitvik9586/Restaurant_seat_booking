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
    private numOfSeats: number,
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
    console.log(`Selected number of seats: ${this.numOfSeats}\n`);
    
    if (this.restaurant.isSeatsAvailable(this.date, this.timeSlot, this.numOfSeats)) {
      const payableAmount = this.restaurant.calculateAmount(this.numOfSeats);

      console.log(`Proceed to pay ${payableAmount}...\n`)

      if (this.payment.process(payableAmount)) {
        this.id = this.generateBookingId();

        this.customer.addBooking(this);

        this.restaurant.removeSeatsAvailability(this.date, this.timeSlot, this.numOfSeats);

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
  }

  public cancel(): void {
    console.log(`Cancellation started for booking having id ${this.id}\n`);

    const refundAmount = this.restaurant.calculateRefundAmount(this.numOfSeats);

    if (this.payment.refund(refundAmount)) {
      this.restaurant.addSeatsAvailability(this.date, this.timeSlot, this.numOfSeats);

      this.status = BookingStatus.CANCELLED;
      console.log("Your booking is cancelled. \n ");
      return;
    }
    console.log("Your booking cancelation failed due to some issue.\n ");
  }

  public reschedule(newDate: string, newnumOfSeats: number, newTimeSlot: string, newPaymentMethod?: Payment): void {
    console.log('Reschedule started for selected booking...\n');

    if (this.status == BookingStatus.CANCELLED) return console.log("Cancelled booking can not be rescheduled.\n");

    console.log(`New selected date: ${newDate}\n`);
    console.log(`New selected timeslot: ${newTimeSlot}\n`);
    console.log(`New selected number of seats: ${newnumOfSeats}\n`);

    const isSameDateTime = (this.date == newDate && this.timeSlot == newTimeSlot) ? true : false;

    if (isSameDateTime) {
      this.restaurant.addSeatsAvailability(this.date, this.timeSlot, this.numOfSeats);
    }

    if (this.restaurant.isSeatsAvailable(newDate, newTimeSlot, newnumOfSeats)) {
      const seatDifference = newnumOfSeats - this.numOfSeats;
      const amountDifference = this.restaurant.calculateAmount(seatDifference)

      if (seatDifference > 0) {
        let oldPayment = this.payment;

        if (newPaymentMethod && newPaymentMethod !== this.payment) {
          this.payment = newPaymentMethod;
          this.payment.amount = oldPayment.amount;
        }

        if (!this.payment.process(amountDifference)){
          this.payment = oldPayment;
          console.log('Reschedule failed due to payment failure.\n Please re-try.\n');
          return;
        } 
      } else if (seatDifference < 0){
        this.payment.refund(amountDifference)
      }

      this.restaurant.removeSeatsAvailability(newDate, newTimeSlot, newnumOfSeats);

      if (!isSameDateTime) {
        this.restaurant.addSeatsAvailability(this.date, this.timeSlot, this.numOfSeats)
      }

      this.date = newDate;
      this.numOfSeats = newnumOfSeats;
      this.timeSlot = newTimeSlot;
      this.status = BookingStatus.RESCHEDULE;

      console.log(`Your booking is Rescheduled.\n
==========================================\n`);
      return;
    }

    if (isSameDateTime) {
      this.restaurant.removeSeatsAvailability(this.date, this.timeSlot, this.numOfSeats);
    }

    console.log('Reschedule is failed.\nPlease re-try.');
  }

  public getDetails(): string {
    return `
    Booking ID: ${this.id}
    Date: ${this.date}
    Timeslot: ${this.timeSlot}
    Seats: ${this.numOfSeats}
    Status: ${this.status}
    Payment Details:
      Payment type: ${this.payment.paymentType}
      Total amount: ${this.payment.amount}
      Payment status: ${this.payment.status}
  `
  }
}