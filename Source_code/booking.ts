import { BookingDetails } from "./bookingHistory";
import { PaymentDetail } from "./payment";

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELED = "CANCELLED",
}

export class Booking {
  constructor(
    private bookingId: string,
    private bookingDate: string,
    private numOfPerson: number,
    private timeSlot: string,
    private payment: PaymentDetail,
    private status: BookingStatus = BookingStatus.PENDING
  ) {}

  public confirmBooking(): BookingDetails {
    this.status = BookingStatus.CONFIRMED;

    const booking = {
      bookingId: this.bookingId,
      bookingDate: this.bookingDate,
      numOfPerson: this.numOfPerson,
      timeSlot: this.timeSlot,
      status: this.status,
      payment: this.payment,
    };

    console.log(`Your booking is confirmed.\n
==========================================\n`);

    return booking;
  }

  public cancelBooking(bookingId: string): BookingDetails {
    this.status = BookingStatus.CANCELED;

    const booking = {
      bookingId: this.bookingId,
      bookingDate: this.bookingDate,
      numOfPerson: this.numOfPerson,
      timeSlot: this.timeSlot,
      status: this.status,
      payment: this.payment,
    };

    console.log(`Your booking is update.\n
==========================================\n`);

    return booking;
  }

  public rescheduleBooking() {
    
    const booking = {
      bookingId: this.bookingId,
      bookingDate: this.bookingDate,
      numOfPerson: this.numOfPerson,
      timeSlot: this.timeSlot,
      status: this.status,
      payment: this.payment,
    };

    return booking;
  }
}
