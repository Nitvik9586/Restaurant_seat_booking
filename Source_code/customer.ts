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

  public getBooking(bookingId: string): Booking {
    return this.bookingHistory.find(booking => booking.getId() == bookingId) as Booking
  }

  public viewBookings(): void {
    this.bookingHistory.forEach(booking => {
      console.log(booking);
    });
  }
}
