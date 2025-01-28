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
  }

  public getHistory(bookingId: string): bookingDetail | undefined {
    for (let i = 0; i < this.bookingHistoryarr.length; i++) {
      if (this.bookingHistoryarr[i].bookingId == bookingId) {
        return this.bookingHistoryarr[i];
      }
    }
  }
}
