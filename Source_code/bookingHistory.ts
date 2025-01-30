import { PaymentDetail, PaymentStatus } from "./payment";
import { BookingStatus } from "./booking";

export type BookingDetails = {
  customerId: string;
  bookingId: string;
  bookingDate: string;
  numOfPerson: number;
  timeSlot: string;
  status: BookingStatus;
  payment: PaymentDetail
};

export class BookingHistory {
  constructor(private bookingHistory: BookingDetails[] = []) { }

  public addBookingHistory(bookingHistory: BookingDetails): void {
    this.bookingHistory.push(bookingHistory);
    // console.log('new Booking is added to history.')
  }

  getFullBookingHistory(customerId: string): BookingDetails[] {
    const bookings = this.bookingHistory.filter(booking => booking.customerId == customerId)
    return bookings;
  }

  public getBookingHistroy(customerId: string, bookingId: string): BookingDetails | undefined {
    const booking = this.bookingHistory.find(booking => booking.customerId == customerId && booking.bookingId == bookingId)

    if (!booking) {
      console.log('Booking not found.')
    } else {
      // console.log('Booking found.')
      return booking;
    }
  }

  public updateHistory(booking: BookingDetails) {
    for (let i = 0; i < this.bookingHistory.length; i++) {
      if (this.bookingHistory[i].bookingId == booking.bookingId) {
        this.bookingHistory[i] = booking;
      }
    }
    // console.log("Updated booking is updated in history.");
  }


}
