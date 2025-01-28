import { Restaurant } from "./restaurant";
import { bookingHistory } from "./bookingHistory";

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

export class Booking {
  constructor(
    private bookingId: string,
    private bookingDate: string,
    private numOfPerson: number,
    private timeSlot: string,
    private Status: BookingStatus = BookingStatus.PENDING
  ) {}

  private res = new Restaurant(30);
  
  private bookHistoryobj = new bookingHistory();
  public confirmBooking() {
    this.res.initializeSeatAvailblity();
    console.log("Payment done");
    // console.log(this.bookingDate);
    
    this.bookHistoryobj.addBookingHistory(
      this.bookingId,
      this.bookingDate,
      this.numOfPerson,
      this.timeSlot,
      this.Status,
      900,
      paymentStatus.PAID
    );
    // if (this.res.isAvalible(this.bookingDate,this.timeSlot,this.numOfPerson)) {

    //     console.log("Booking is done");

    // }
  }

  public cancelBooking(bookingId: string){
    this.bookHistoryobj.getHistory(bookingId);
    this.bookHistoryobj.addBookingHistory(
        this.bookingId,
        this.bookingDate,
        this.numOfPerson,
        this.timeSlot,
        this.Status,
        900,
        paymentStatus.REFUNDED
      );
    this.res.addSeat(this.bookingDate,this.timeSlot,this.numOfPerson);
    // console.log(this.res.getSeatAvaibility());
    
    console.log( this.bookHistoryobj.getHistory(bookingId));
    
  }
}

const b1 = new Booking("b1","2025-01-29",5,"1 P.M.");
b1.confirmBooking();
b1.cancelBooking("b1");