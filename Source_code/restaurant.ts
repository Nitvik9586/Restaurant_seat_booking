type SeatAvaibility = {
  [date: string]: Seat;
};

type Seat = {
  [timeSlot: string]: number;
};

export class Restaurant {
  constructor(
    private totalSeat: number = 0,
    private seatAvaibility: SeatAvaibility = {}
  ) {}

  public initializeSeatAvailability(): void {
    const timeSlots: string[] = [
      "11 A.M.",
      "12 P.M.",
      "1 P.M.",
      "2 P.M.",
      "3 P.M.",
      "7 P.M.",
      "8 P.M.",
      "9 P.M.",
      "10 P.M.",
      "11 P.M.",
    ];

    const start = new Date();
    const dates: string[] = [];

    for (let i = 0; i < 7; i++) {
      
      const date: string = new Date(start.setDate(start.getDate() + 1))
      .toISOString()
      .split("T")[0];
      dates.push(date);
    }

    for (let i = 0; i < dates.length; i++) {
      const seats: Seat = {};
      for (let j = 0; j < timeSlots.length; j++) {
        seats[timeSlots[j]] = this.totalSeat;
      }
      this.seatAvaibility[dates[i]] = seats;
    }
  }

  getSeatAvaibility(): SeatAvaibility{
      return this.seatAvaibility;
  }

  public isAvalible(
    date: string,
    timeSlot: string,
    numOfSeat: number
  ): boolean {
    if (this.seatAvaibility[date][timeSlot] >= numOfSeat) {
      return true;
    }
    return false;
  }

  public addAvailability(date: string, timeSlot: string, numOfSeat: number): void {
    this.seatAvaibility[date][timeSlot] += numOfSeat;
  }

  public removeAvailability(date: string, timeSlot: string, numOfSeat: number): void {
    this.seatAvaibility[date][timeSlot] -= numOfSeat;
  }
}
