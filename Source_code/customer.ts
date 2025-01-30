import { Payment, PaymentStatus } from "./payment";
import { Booking, BookingStatus } from "./booking";



export class Customer {
  constructor(private customerId: string = '' ,private bookingHistory: Booking[] = []) { }

  public addBookingHistory(bookingHistory: Booking): void {
    this.bookingHistory.push(bookingHistory);
    // console.log('new Booking is added to history.')
  }

  getFullBookingHistory() {
    // const bookings = this.bookingHistory.filter(booking => booking.customerId == customerId)
    // return bookings;
    console.log(this.bookingHistory);
    
  }

  public getBookingHistroy(customerId: string, bookingId: string): Booking | undefined {
    const booking = this.bookingHistory.find(booking => booking.getCustomerId() == customerId && booking.getId() == bookingId)
    console.log(this.bookingHistory);
    
    
    if (!booking) {
      console.log('Booking not found.')
    } else {
      // console.log('Booking found.')
      return booking;
    }
  }

  public updateHistory(booking: Booking) {
    for (let i = 0; i < this.bookingHistory.length; i++) {
      if (this.bookingHistory[i].getId() == booking.getId()) {
        this.bookingHistory[i] = booking;
      }
    }
    // console.log("Updated booking is updated in history.");
  }


}
