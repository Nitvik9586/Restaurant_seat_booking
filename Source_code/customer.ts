import { Booking } from "./booking";

export class Customer {
  constructor(private id: string,
    private name: string,
    private contactNum: string,
    private email: string,
    private bookingHistory: Booking[] = []) { }

  public getId() {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  public addBooking(booking: Booking): void {
    this.bookingHistory.push(booking);
    // console.log('new Booking is added to history.')
  }

  public getBookingById(bookingId: string): Booking {
    return this.bookingHistory.find(booking => booking.getId() == bookingId) as Booking
  }

  public viewBookings(): void {
    console.log(`Bookigs of ${this.name}\n `);

    this.bookingHistory.forEach(booking => {
      console.log(booking);

    });
  }
}
