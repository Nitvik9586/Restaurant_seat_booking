type bookingDetail = {
  bookingId: string;
  bookingDate: string;
  numOfPerson: number;
  timeSlot: string;
  status: BookingStatus;
  amount: number;
  paymentStatus: paymentStatus;
};

enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELED = "CANCELLED",
}

enum paymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  REFUNDED = "REFUNDED",
}

export class bookingHistory {
  constructor(private bookingHistoryarr: bookingDetail[] = []) {}

  public addBookingHistory(
    bookingId: string,
    bookingDate: string,
    numOfPerson: number,
    timeSlot: string,
    status: BookingStatus,
    amount: number,
    paymentStatus: paymentStatus
  ): void {
    this.bookingHistoryarr.push({
      bookingId,
      bookingDate,
      numOfPerson,
      timeSlot,
      status,
      amount,
      paymentStatus,
    });
    // console.log(this.bookingHistoryarr);
    
  }

  public getHistory(bookingId: string): bookingDetail | undefined {
        const customerArr: any = [];
    for (let i = 0; i < this.bookingHistoryarr.length; i++) {
      if (this.bookingHistoryarr[i].bookingId == bookingId) {
        customerArr.push(this.bookingHistoryarr[i]);
      }
    }

    return customerArr;
  }

  public updateHistory( bookingId: string,
    bookingDate: string,
    numOfPerson: number,
    timeSlot: string,){
        let updateArr: any =[];

    for (let i = 0; i < this.bookingHistoryarr.length; i++) {
        if (this.bookingHistoryarr[i].bookingId == bookingId) {
          updateArr = this.bookingHistoryarr[i];
        }
      }
      console.log("update");
      
      updateArr.bookingDate = bookingDate;
      updateArr.numOfPerson = numOfPerson;
      updateArr.timeSlot = timeSlot;
      console.log(this.bookingHistoryarr);
      return updateArr;
      
  }
}
