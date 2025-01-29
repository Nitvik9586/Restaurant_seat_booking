import { Restaurant } from "./restaurant";
import { BookingHistory } from "./bookingHistory";
import { Booking, BookingStatus } from "./booking";
import { Payment, PaymentDetail } from "./payment";
import { BookingDetails } from "./bookingHistory";

class Simulator {
  constructor(
    private restaurant: Restaurant = new Restaurant(),
    private bookingHistory: BookingHistory = new BookingHistory()
  ) { }

  setRestaurant(totalSeat: number): void {
    this.restaurant = new Restaurant(totalSeat);
    this.restaurant.initializeSeatAvailblity();
  }

  simulateBooking(bookingId: string, bookingDate: string, numOfPerson: number, timeSlot: string) {

    const isSeatsAvailable = this.restaurant.isAvalible(bookingDate, timeSlot, numOfPerson);

    if (!isSeatsAvailable) {
      console.log(`Required seats ${numOfPerson} is not available for date ${bookingDate} and time slot ${timeSlot}.`);
      return;
    }

    console.log(`${numOfPerson} seats is available for date ${bookingDate} and time slot ${timeSlot}.\n`);

    const payableAmount = 10 * numOfPerson;
    const payment = new Payment(payableAmount);

    console.log(`Proceed to pay ${payableAmount}...\n`)
    const isPaid = payment.process();

    if (!isPaid) {
      console.log(`Booking can not be done due to failed payment.\n
================================================================\n`);
      return;
    }

    const paymentDetail = {
      amount: payment.getAmount(),
      status: payment.getStatus()
    };

    const booking = new Booking(bookingId, bookingDate, numOfPerson, timeSlot, paymentDetail)

    const confirmedBooking = booking.confirmBooking();
    this.bookingHistory.addBookingHistory(confirmedBooking);

    this.restaurant.removeSeat(bookingDate, timeSlot, numOfPerson);

  }

  simulateCancelBooking(bookingId: string): void {

    let booking: BookingDetails | undefined = this.bookingHistory.getBookingHistroy(bookingId);

    if (!booking) return;
    const payment = new Payment(booking.payment.amount);
    payment.refund();

    booking.payment.status = payment.getStatus();


    this.restaurant.addSeat(booking.bookingDate, booking.timeSlot, booking.numOfPerson);

    const paymentDetail = {
      amount: booking.payment.amount,
      status: booking.payment.status
    }

    const bookingTocancel = new Booking(
      booking.bookingId,
      booking.bookingDate,
      booking.numOfPerson,
      booking.timeSlot,
      paymentDetail
    );

    booking = bookingTocancel.cancelBooking(bookingId);
    this.bookingHistory.updateHistory(booking);
  }

  simulateReschedule(bookingId: string, bookingDate: string, numOfPerson: number, timeSlot: string) {
    const oldBooking = this.bookingHistory.getBookingHistroy(bookingId);
    const isSeatAvailable = this.restaurant.isAvalible(bookingDate, timeSlot, numOfPerson);

    if (!oldBooking) return;

    if (oldBooking.status == "CANCELLED") {
      console.log("Your Booking is already cancelled You can't reschedule it.\n");
      return;
    }

    if (oldBooking?.bookingDate == bookingDate && oldBooking.timeSlot == timeSlot) {
      this.restaurant.removeSeat(bookingDate, timeSlot, oldBooking.numOfPerson)
    }

    if (!isSeatAvailable) {
      console.log(`Reschedule for seats ${numOfPerson} is not available for date ${bookingDate} and time slot ${timeSlot}.`);
      if (oldBooking?.bookingDate == bookingDate && oldBooking.timeSlot == timeSlot) {
        this.restaurant.addSeat(bookingDate, timeSlot, oldBooking.numOfPerson)
      }
      return;
    }

    const updatedBooking: BookingDetails = {
      bookingId: oldBooking.bookingId,
      bookingDate: bookingDate,
      numOfPerson: numOfPerson,
      timeSlot: timeSlot,
      status: oldBooking.status,
      payment: oldBooking.payment
    }

    if (oldBooking.numOfPerson < numOfPerson) {
      const newNumOfPerson = numOfPerson - oldBooking.numOfPerson
      const payableAmount = (newNumOfPerson) * 10;

      const payment = new Payment(payableAmount)
      payment.process();

      updatedBooking.payment.amount += payableAmount;
      this.restaurant.removeSeat(bookingDate, timeSlot, newNumOfPerson);
    } else if (oldBooking.numOfPerson > numOfPerson) {
      const newNumOfPerson = oldBooking.numOfPerson - numOfPerson;
      const payableAmount = (newNumOfPerson) * 10;

      const payment = new Payment(payableAmount);
      payment.refund();

      this.restaurant.addSeat(bookingDate, timeSlot, newNumOfPerson);
      updatedBooking.payment.amount -= payableAmount;
    }

    // const updatedBookingI = new Booking(
    //   oldBooking.bookingId,
    //   bookingDate,
    //   numOfPerson,
    //   timeSlot,
    //   oldBooking.payment,
    //   oldBooking.status
    // )

    this.bookingHistory.updateHistory(updatedBooking)
    this.bookingHistory.getFullBookingHistory();
  }
}

const s1 = new Simulator();
s1.setRestaurant(30);
s1.simulateBooking("b1", "2025-01-30", 5, "1 P.M.")
// s1.simulateCancelBooking("b1");
s1.simulateReschedule("b1", "2025-01-30", 7, "1 P.M.")
s1.simulateReschedule("b1", "2025-01-30", 19, "1 P.M.")

// s1.simulateCancelBooking("b2");