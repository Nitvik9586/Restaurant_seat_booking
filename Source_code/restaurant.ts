import { Booking, BookingStatus } from "./booking";
import { Customer } from "./customer";
import { TimeSlot } from "./timeSlot";

export type SeatAvaibility = {
  [date: string]: { [timeSlot: string]: number };
};

type TimeSlotCapacity = {
  [timeSlot: string]: number
};

export class Restaurant {
  private bookingCount: number = 0;

  constructor(
    private totalSeat: number = 0,
    private seatsAvaibility: SeatAvaibility = {},
    private timeSlot = new TimeSlot(),
    private customers: Customer[] = []
  ) {

    const start = new Date();
    const dates: string[] = [];

    for (let i = 0; i < 7; i++) {

      const date: string = new Date(start.setDate(start.getDate() + 1))
        .toISOString()
        .split("T")[0];
      dates.push(date);
    }

    for (let i = 0; i < dates.length; i++) {
      const timeSlotCapacity: TimeSlotCapacity = {};
      for (let j = 0; j < this.timeSlot.getTimeSlots().length; j++) {
        timeSlotCapacity[this.timeSlot.getTimeSlots()[j]] = this.totalSeat;
      }
      this.seatsAvaibility[dates[i]] = timeSlotCapacity;
    }
  }

  getSeatAvailability(): SeatAvaibility {
    console.log(this.seatsAvaibility);
    return this.seatsAvaibility;
    ;
  }

  private generateBookingId(): string {
    return `b${this.bookingCount}`;
  }

  isSeatsAvailable(date: string, timeSlot: string, numOfSeat: number): boolean {
    const seatAvailability = this.seatsAvaibility[date][timeSlot];
    if (seatAvailability >= numOfSeat) {
      console.log(`${numOfSeat} seats is available for date ${date} and time slot ${timeSlot}.\n`);
      return true;
    }
    console.log(`Required seats ${numOfSeat} is not available for date ${date} and time slot ${timeSlot}.\n`);
    return false;
  }

  showAvailableTimeSlots(date: string, numOfSeat: number) {
    let availableTimeSlot: TimeSlotCapacity = {};

    for (let i = 0; i < this.timeSlot.getTimeSlots().length; i++) {
      const timeSlot = this.timeSlot.getTimeSlots()[i];
      
      if (this.seatsAvaibility[date][timeSlot] >= numOfSeat) {
          availableTimeSlot[timeSlot] = this.seatsAvaibility[date][timeSlot];
      }
  }

    console.log(`Available slots for ${date} : `, availableTimeSlot,'\n');
  }

  addSeatsAvailability(date: string, timeSlot: string, numOfSeat: number): void {
    this.seatsAvaibility[date][timeSlot] += numOfSeat;
  }

  removeSeatsAvailability(date: string, timeSlot: string, numOfSeat: number): void {
    this.seatsAvaibility[date][timeSlot] -= numOfSeat;
  }

  registerCustomer(cutomerId: string, name: string, contactNum: string, email: string) {
    if (this.getCustomer(cutomerId)) {
      return;
    }

    const customer = new Customer(cutomerId, name, contactNum, email);
    this.customers.push(customer);
  }

  getCustomer(customerId: string): Customer {
    const customer = this.customers.find(customer => customer.getId() == customerId);
    return customer as Customer;
  }

  bookSeat(customerId: string, date: string, timeSlot: string, numOfSeat: number): void {
    const customer = this.getCustomer(customerId);

    if (this.isSeatsAvailable(date, timeSlot, numOfSeat)) {

      console.log(`Booking started by ${customer.getName()}...\n`);

      const bookingId = this.generateBookingId();

      const booking = new Booking(bookingId, date, numOfSeat, timeSlot)

      booking.confirm();

      if (booking.getStatus() == BookingStatus.CONFIRMED) {
        customer.addBooking(booking);

        this.removeSeatsAvailability(date, timeSlot, numOfSeat);

        this.bookingCount++;

        console.log('Your booking confirmed.\n===============================================\n');
        // customer.viewBookings();
        return;
      }
      console.log('Your booking is not confirmed.');
      return;
    }
    console.log(`Seats are not available for selected timeslot.
                Please select another time slot.`);
  }

  cancleSeat(customerId: string, bookingId: string): void {
    const customer = this.getCustomer(customerId);

    const booking = customer.getBookingById(bookingId);


    booking.cancel();

    if (booking.getStatus() == BookingStatus.CANCELLED) {
      console.log("Your booking is cancelled. \n ");

      this.addSeatsAvailability(booking.getDate(), booking.getTimeSlot(), booking.getnumOfSeat());
    }

    console.log("Your booking cancelation failed due to some issue.\n ");
    return;
  }

  rescheduleSeat(customerId: string, bookingId: string, newDate: string, newnumOfSeat: number, newTimeSlot: string) {
    const customer = this.getCustomer(customerId);

    const booking = customer.getBookingById(bookingId);

    const oldDate = booking.getDate()
    const oldTimeSlot = booking.getTimeSlot()
    const oldNumPerson = booking.getnumOfSeat()

    if (booking.getStatus() == BookingStatus.CANCELLED) {
      console.log("Cancelled booking can not be rescheduled.\n");
      return;
    }

    const isSameDateTime = booking.checkSameDateAndTime(newDate, newTimeSlot);

    if (isSameDateTime) {
      this.addSeatsAvailability(newDate, newTimeSlot, booking.getnumOfSeat());
    }

    if (this.isSeatsAvailable(newDate, newTimeSlot, newnumOfSeat)) {
      booking.reschedule(newDate, newnumOfSeat, newTimeSlot);

      if (booking.getStatus() == BookingStatus.RESCHEDULE) {
        this.removeSeatsAvailability(newDate, newTimeSlot, newnumOfSeat);

        if (!isSameDateTime) {
          this.addSeatsAvailability(oldDate, oldTimeSlot, oldNumPerson)
        }

      }

      console.log(`Rescheduled booking:`, booking);
      return;
    }

    if (isSameDateTime) {
      this.removeSeatsAvailability(newDate, newTimeSlot, booking.getnumOfSeat());
    }

    console.log('Reschedule is failed.\n');

  }

  viewCustomersBookings(): void {
    this.customers.forEach(customer => {
      console.log(customer);
      // customer.viewBookings()
    })
  }
}


