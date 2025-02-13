import { Booking } from "./booking";

export class Customer {
  constructor(
    public readonly id: string,
    public readonly name: string,
    private contactNum: string,
    private email: string,
    private bookingHistory: Booking[] = []
  ) { }

  public addBooking(booking: Booking): void {
    this.bookingHistory.push(booking);
  }

  public getBooking(bookingId: string): Booking {
    return this.bookingHistory.find(booking => booking.getId() == bookingId) as Booking
  }

  public getBookings(): Booking[] {
    return this.bookingHistory;
  }

  public showBookings(): void {
    let bookings: string[] = [];

    this.bookingHistory.forEach(booking => {
      const index = this.bookingHistory.indexOf(booking);
      bookings.push(`\nBooking ${index + 1}:
    Restaurant: ${booking.restaurant.name}
    Addres: ${booking.restaurant.address}${booking.getDetails()}`)
    });

    if (bookings.length > 0) {
      console.log(`${this.name}'s Bookings: \n ${bookings}`);
      return;
    }

    console.log(`${this.name}'s booking history is empty`);
  }
}
