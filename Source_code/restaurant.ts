import { TimeSlot } from "./timeSlot";

export type SeatAvaibility = {
  [date: string]: { [timeSlot: string]: number };
};

type TimeSlotCapacity = {
  [timeSlot: string]: number
};

export class Restaurant {

  constructor(
    private id: string,
    private name: string,
    private address: string,
    private totalSeats: number = 0,
    private pricePerSeat: number,
    private cancelFeeRate: number = 0,
    private seatsAvaibility: SeatAvaibility = {},
    private timeSlot = new TimeSlot(),
    private preBookingDays: number = preBookingDays
  ) {

    const timeSlots = this.timeSlot.getTimeSlots();
    const start = new Date();
    const dates: string[] = [];

    for (let i = 0; i < preBookingDays; i++) {

      const date: string = new Date(start.setDate(start.getDate() + 1))
        .toISOString()
        .split("T")[0];
      dates.push(date);
    }

    for (let i = 0; i < dates.length; i++) {
      const timeSlotCapacity: TimeSlotCapacity = {};
      for (let j = 0; j < timeSlots.length; j++) {
        timeSlotCapacity[timeSlots[j]] = this.totalSeats;
      }
      this.seatsAvaibility[dates[i]] = timeSlotCapacity;
    }
  }

  getId(): string {
    return this.id;
  }

  getAddress(): string {
    return this.address;
  }

  getName(): string {
    return this.name;
  }

  getSeatAvailability(): SeatAvaibility {
    console.log(this.seatsAvaibility);
    return this.seatsAvaibility;
  }

  isSeatsAvailable(date: string, timeSlot: string, numOfSeat: number): boolean {
    const seatAvailability = this.seatsAvaibility[date][timeSlot];

    console.log(`Checking availability...\n...\n...\n`);

    if (seatAvailability >= numOfSeat) {
      console.log(`${numOfSeat} seats is available for date ${date} and time slot ${timeSlot}.\n`);
      return true;
    }
    console.log(`Required seats ${numOfSeat} is not available for date ${date} and time slot ${timeSlot}.\n`);
    return false;
  }

  calculateRefundAmount(numOfSeat: number): number {
    const cancellationCharge = this.calculateAmount(numOfSeat) * this.cancelFeeRate;

    console.log(`Cancelation charges is ${cancellationCharge}.\n`);

    return this.calculateAmount(numOfSeat) - cancellationCharge;
  }

  calculateAmount(numOfSeats: number): number {
    console.log(`Total payable amount for ${numOfSeats} seat is ${numOfSeats * this.pricePerSeat}.\n`)
    return numOfSeats * this.pricePerSeat;
  }

  showAvailableTimeSlots(date: string, numOfSeat: number): TimeSlotCapacity {
    const timeSlots = this.timeSlot.getTimeSlots()
    let availableTimeSlots: TimeSlotCapacity = {};

    for (let i = 0; i < timeSlots.length; i++) {
      const timeSlot = timeSlots[i];

      if (this.seatsAvaibility[date][timeSlot] >= numOfSeat) {
        availableTimeSlots[timeSlot] = this.seatsAvaibility[date][timeSlot];
      }
    }

    console.log(`Available slots for ${date} : `, availableTimeSlots, '\n');
    return availableTimeSlots;
  }

  addSeatsAvailability(date: string, timeSlot: string, numOfSeat: number): void {
    this.seatsAvaibility[date][timeSlot] += numOfSeat;
  }

  removeSeatsAvailability(date: string, timeSlot: string, numOfSeat: number): void {
    this.seatsAvaibility[date][timeSlot] -= numOfSeat;
  }
}