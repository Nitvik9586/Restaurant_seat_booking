export type SeatAvaibility = {
  [date: string]: Seat;
};

type Seat = {
  [timeSlot: string]: number;
};

export class Restaurant {

  constructor(
    private totalSeat: number = 0,
    private seatsAvaibility: SeatAvaibility = {}
  ) {
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
      this.seatsAvaibility[dates[i]] = seats;
    }
  }

  getSeatAvaibility(): SeatAvaibility {
     console.log(this.seatsAvaibility);
     return this.seatsAvaibility;
    ;
  }

  public isSeatsAvalible(
    date: string,
    timeSlot: string,
    numOfPerson: number
  ): boolean {
    const seatAvailability = this.seatsAvaibility[date][timeSlot];
    if (seatAvailability >= numOfPerson) {
      console.log(`${numOfPerson} seats is available for date ${date} and time slot ${timeSlot}.\n`);
      return true;
    }
    console.log(`Required seats ${numOfPerson} is not available for date ${date} and time slot ${timeSlot}.`);
    return false;
  }

  public addSeatsAvailability(date: string, timeSlot: string, numOfSeat: number): void {
    this.seatsAvaibility[date][timeSlot] += numOfSeat;
  }

  public removeSeatsAvailability(date: string, timeSlot: string, numOfSeat: number): void {
    this.seatsAvaibility[date][timeSlot] -= numOfSeat;
  }

  // updateSeatAvailability(oldNumberOfPerson: number, newNumberOfPerson: number, bookingDate: string, timeSlot: string) {
    
  //   console.log(oldNumberOfPerson,newNumberOfPerson);
  //   // if (oldNumberOfPerson < newNumberOfPerson) { 
     
  //     this.removeSeatsAvailability(bookingDate, timeSlot, newNumberOfPerson);
  //   // } else if (oldNumberOfPerson > newNumberOfPerson) {
  //   //   this.removeSeatsAvailability(bookingDate, timeSlot, newNumberOfPerson);
  //   // }
  // }
}
