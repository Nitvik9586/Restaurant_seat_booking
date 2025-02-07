import { Booking, BookingStatus } from "./booking";
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

  bookSeat(restaurant: Restaurant, date: string, timeSlot: string, numOfSeat: number): void {

    if (restaurant.isSeatsAvailable(date, timeSlot, numOfSeat)) {

      console.log(`Booking started by ${this.name}...\n`);

      const bookingId = this.generateBookingId();

      const booking = new Booking(this.id,bookingId, date, numOfSeat, timeSlot)

      booking.confirm();

      if (booking.getStatus() == BookingStatus.CONFIRMED) {
        this.addBooking(booking);

        restaurant.removeSeatsAvailability(date, timeSlot, numOfSeat);

        this.bookingCount++;

        console.log('Your booking confirmed.\n===============================================\n');
        // customer.viewBookings();
        return;
      }
      
      console.log('Your booking is not confirmed.');
      this.bookingCount--;
      return;
    }
    console.log(`Seats are not available for selected timeslot.
                Please select another time slot.`);
  }

  cancleSeat(restaurant: Restaurant, bookingId: string): void {

    const booking = this.getBooking(bookingId);


    booking.cancel();

    if (booking.getStatus() == BookingStatus.CANCELLED) {
      console.log("Your booking is cancelled. \n ");

      restaurant.addSeatsAvailability(booking.getDate(), booking.getTimeSlot(), booking.getnumOfSeat());
      return;
    }

    console.log("Your booking cancelation failed due to some issue.\n ");
    return;
  }

  rescheduleSeat(restaurant: Restaurant, bookingId: string, newDate: string, newnumOfSeat: number, newTimeSlot: string): void {

    const booking = this.getBooking(bookingId);

    const oldDate = booking.getDate()
    const oldTimeSlot = booking.getTimeSlot()
    const oldNumPerson = booking.getnumOfSeat()

    if (booking.getStatus() == BookingStatus.CANCELLED) {
      console.log("Cancelled booking can not be rescheduled.\n");
      return;
    }

    const isSameDateTime = booking.checkSameDateAndTime(newDate, newTimeSlot);

    if (isSameDateTime) {
      restaurant.addSeatsAvailability(newDate, newTimeSlot, booking.getnumOfSeat());
    }

    if (restaurant.isSeatsAvailable(newDate, newTimeSlot, newnumOfSeat)) {
      booking.reschedule(newDate, newnumOfSeat, newTimeSlot);

      if (booking.getStatus() == BookingStatus.RESCHEDULE) {
        restaurant.removeSeatsAvailability(newDate, newTimeSlot, newnumOfSeat);

        if (!isSameDateTime) {
          restaurant.addSeatsAvailability(oldDate, oldTimeSlot, oldNumPerson)
        }

      }

      console.log(`Rescheduled booking:`, booking);
      return;
    }

    if (isSameDateTime) {
      restaurant.removeSeatsAvailability(newDate, newTimeSlot, booking.getnumOfSeat());
    }

    console.log('Reschedule is failed.\n');

  }
}
