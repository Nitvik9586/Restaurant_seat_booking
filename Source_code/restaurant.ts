import { TimeSlot } from "./timeSlot";

export type SeatAvaibility = {
  [date: string]: { [timeSlot: string]: number };
};

type TimeSlotCapacity = {
  [timeSlot: string]: number
};

export class Restaurant {

  constructor(
    public readonly id: string,
    public readonly name: string,
    private address: string,
    private totalSeats: number = 0,
    private pricePerSeat: number,
    private cancelFeeRate: number = 0,
    private seatsAvaibility: SeatAvaibility = {},
    private timeSlot = new TimeSlot(),
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
        timeSlotCapacity[this.timeSlot.getTimeSlots()[j]] = this.totalSeats;
      }
      this.seatsAvaibility[dates[i]] = timeSlotCapacity;
    }
  }
  
  getSeatAvailability(): SeatAvaibility {
    console.log(this.seatsAvaibility);
    return this.seatsAvaibility;
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

  getRefundAmount(numOfSeat: number): number {
    const cancellationCharge = this.getTotalAmount(numOfSeat) * this.cancelFeeRate;
    
    console.log(`Cancelation charges is ${cancellationCharge}.\n`);

    return this.getTotalAmount(numOfSeat) - cancellationCharge;
  }

  getTotalAmount(numOfSeats: number): number {
    return numOfSeats * this.pricePerSeat;
  }

  showAvailableTimeSlots(date: string, numOfSeat: number): TimeSlotCapacity {
    let availableTimeSlots: TimeSlotCapacity = {};

    for (let i = 0; i < this.timeSlot.getTimeSlots().length; i++) {
      const timeSlot = this.timeSlot.getTimeSlots()[i];

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