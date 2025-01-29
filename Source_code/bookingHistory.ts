import { PaymentDetail } from "./payment";
import { BookingStatus } from "./booking";

export type BookingDetails = {
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
  }

  getFullBookingHistory(){
    console.log(this.bookingHistory);
  }

  public getBookingHistroy(bookingId: string): BookingDetails | undefined {
    const booking = this.bookingHistory.find(booking => booking.bookingId == bookingId)
    
    if (booking == undefined) {
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
    // console.log("Booking is updated.");
  }
}