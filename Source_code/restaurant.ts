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

    console.log(`Available slots for ${date} : `, availableTimeSlot, '\n');
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

  viewCustomersBookings(): void {
    this.customers.forEach(customer => {
      console.log(`ID: ${customer.getId()} \nName: ${customer.getName()}`);

      customer.viewBookings()
    })
  }
}


