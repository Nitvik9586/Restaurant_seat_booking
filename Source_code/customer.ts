import { Booking, BookingStatus } from "./booking";
import { Payment, PaymentType } from "./payment";
import { Restaurant } from "./restaurant";

export class Customer {

  constructor(private id: string,
    private name: string,
    private contactNum: string,
    private email: string,
    private bookingCount: number = 0,
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

  private generateBookingId(): string {
    return `b${++this.bookingCount}`;
  }

  bookSeat(restaurant: Restaurant, date: string, timeSlot: string, numOfSeat: number, payment: Payment): void {

    if (restaurant.isSeatsAvailable(date, timeSlot, numOfSeat)) {

      console.log(`Booking started by ${this.name}...\n`);

      const bookingId = this.generateBookingId();

      const paymentAmount = numOfSeat * restaurant.getPricePerSeat()
      payment.setAmount(paymentAmount)

      const booking = new Booking(this.id,restaurant.getId(),bookingId, date, numOfSeat, timeSlot,payment)

      booking.confirm(restaurant, payment);
      

      if (booking.getStatus() == BookingStatus.CONFIRMED) {
        this.addBooking(booking);
        return;
      }
      
      console.log('Your booking is not confirmed.');
      this.bookingCount--;
      return;
    }
  }

  cancleSeat(restaurant: Restaurant, bookingId: string): void {
    const booking = this.getBooking(bookingId);

    booking.cancel(restaurant);
    console.log(`Cancelled booking:`, booking);
  }

  rescheduleSeat(restaurant: Restaurant, bookingId: string, newDate: string, newnumOfSeat: number, newTimeSlot: string): void {
    const booking = this.getBooking(bookingId);

    booking.reschedule(restaurant,newDate, newnumOfSeat, newTimeSlot);
    // console.log(`Rescheduled booking:`, booking);  
  }
}
