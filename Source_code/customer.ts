import { Booking} from "./booking";



export class Customer {
  constructor(private id: string ,private bookingHistory: Booking[] = []) { }

  public getId() {
    return this.id;
  }

  public addBooking(booking: Booking): void {
    this.bookingHistory.push(booking);
    // console.log('new Booking is added to history.')
  }

  public viewBookings() {
    console.log(`Bookings of customer with id ${this.id}.\n`);
    
    this.bookingHistory.forEach(booking => {
      console.log(booking)
    });
  }

  public getBookingById(bookingId: string): Booking | undefined {
    const booking = this.bookingHistory.find(booking => booking.getId() == bookingId)
    // console.log(this.bookingHistory);

    if (!booking) {
      console.log('Booking not found.')
    } else {
      // console.log('Booking found.')
      return booking;
    }
  }

  public updateBooking(booking: Booking) {
    for (let i = 0; i < this.bookingHistory.length; i++) {
      if (this.bookingHistory[i].getId() == booking.getId()) {
        this.bookingHistory[i] = booking;
      }
    }
    // console.log("Updated booking is updated in history.");
  }


}
