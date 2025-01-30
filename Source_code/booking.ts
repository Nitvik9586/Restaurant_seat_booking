import { BookingDetails } from "./bookingHistory";
import { PaymentDetail } from "./payment";

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELED = "CANCELLED",
  RESCHEDULE = "RESCHEDULED"
}

export class Booking {
  constructor(
    private customerId: string,
    private bookingId: string,
    private bookingDate: string,
    private numOfPerson: number,
    private timeSlot: string,
    private payment: PaymentDetail,
    private status: BookingStatus = BookingStatus.PENDING
  ) {}

  public confirm(): BookingDetails {
    this.status = BookingStatus.CONFIRMED;

    const booking = {
      customerId: this.customerId,
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

  public cancel(bookingId: string): BookingDetails {
    this.status = BookingStatus.CANCELED;

    const booking = {
      customerId: this.customerId,
      bookingId: this.bookingId,
      bookingDate: this.bookingDate,
      numOfPerson: this.numOfPerson,
      timeSlot: this.timeSlot,
      status: this.status,
      payment: this.payment,
    };

    console.log(`Your booking is cancelled.\n
==========================================\n`);

    return booking;
  }

  public reschedule(): BookingDetails {
    this.status = BookingStatus.RESCHEDULE;

    const booking = {
      customerId: this.customerId,
      bookingId: this.bookingId,
      bookingDate: this.bookingDate,
      numOfPerson: this.numOfPerson,
      timeSlot: this.timeSlot,
      status: this.status,
      payment: this.payment,
    };

    console.log(`Your booking is Reschedulled.\n
==========================================\n`);
    
    return booking;
  }
}
