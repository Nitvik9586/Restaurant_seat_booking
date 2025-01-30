import { Restaurant } from "./restaurant";
import { BookingDetails, BookingHistory } from "./bookingHistory";
import { Booking } from "./booking";
import { Payment } from "./payment";

class Simulator {
  constructor(
    private restaurant: Restaurant = new Restaurant(),
    private bookingHistory: BookingHistory = new BookingHistory()
  ) { }

  setRestaurant(totalSeat: number): void {
    this.restaurant = new Restaurant(totalSeat);
    this.restaurant.initializeSeatAvailability();
  }

  simulateBooking(customerId:string, bookingId: string, bookingDate: string, numOfPerson: number, timeSlot: string) {

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

    const booking = new Booking(customerId,bookingId, bookingDate, numOfPerson, timeSlot, paymentDetail)

    const confirmedBooking = booking.confirm();
    this.bookingHistory.addBookingHistory(confirmedBooking);
    
    this.restaurant.removeAvailability(bookingDate, timeSlot, numOfPerson);

  }

  simulateViewBooking(customerId: string): void {
    const bookings = this.bookingHistory.getFullBookingHistory(customerId);
    console.log('Bookings = ', bookings);
  }

  simulatecancel(customerId: string, bookingId: string): void {

    const booking = this.bookingHistory.getBookingHistroy(customerId, bookingId);

    if (!booking) return;
    const payment = new Payment(booking.payment.amount);
    payment.refund();

    booking.payment.status = payment.getStatus();


    this.restaurant.addAvailability(booking.bookingDate, booking.timeSlot, booking.numOfPerson);

    const paymentDetail = {
      amount: booking.payment.amount,
      status: booking.payment.status
    }

    const bookingTocancel = new Booking(
      booking.customerId,
      booking.bookingId,
      booking.bookingDate,
      booking.numOfPerson,
      booking.timeSlot,
      paymentDetail
    );

    const cancelledBooking = bookingTocancel.cancel(bookingId);
    this.bookingHistory.updateHistory(cancelledBooking);
  }

  simulateReschedule(customerId: string, bookingId: string, bookingDate: string, numOfPerson: number, timeSlot: string) {
    const oldBooking = this.bookingHistory.getBookingHistroy(customerId, bookingId);
    
    if (!oldBooking) return;

    if (oldBooking.status == "CANCELLED") {
      console.log("Your Booking is already cancelled You can't reschedule it.\n");
      return;
    }

    if (oldBooking.bookingDate == bookingDate && oldBooking.timeSlot == timeSlot) {
      this.restaurant.addAvailability(bookingDate, timeSlot, oldBooking.numOfPerson)
    }

    const isSeatAvailable = this.restaurant.isAvalible(bookingDate, timeSlot, numOfPerson); 

    if (!isSeatAvailable) {
      console.log(`Reschedule for seats ${numOfPerson} is not available for date ${bookingDate} and time slot ${timeSlot}.`);
      if (oldBooking.bookingDate == bookingDate && oldBooking.timeSlot == timeSlot) {
        this.restaurant.removeAvailability(bookingDate, timeSlot, oldBooking.numOfPerson)
      }
      return;
    }

    if (oldBooking.numOfPerson < numOfPerson) {
      const newNumOfPerson = numOfPerson - oldBooking.numOfPerson
      const payableAmount = (newNumOfPerson) * 10;

      const payment = new Payment(payableAmount)
      payment.process();
      oldBooking.payment.amount += payableAmount;
      this.restaurant.removeAvailability(bookingDate, timeSlot, newNumOfPerson);
    } else if (oldBooking.numOfPerson > numOfPerson) {
      const newNumOfPerson = oldBooking.numOfPerson - numOfPerson;
      const payableAmount = (newNumOfPerson) * 10;

      const payment = new Payment(payableAmount);
      payment.refund();

      this.restaurant.addAvailability(bookingDate, timeSlot, newNumOfPerson);
      oldBooking.payment.amount -= payableAmount;
    }
    oldBooking.numOfPerson = numOfPerson;


    const bookingUpdate: Booking = new Booking(
      oldBooking.customerId,
      oldBooking.bookingId,
      oldBooking.bookingDate,
      oldBooking.numOfPerson,
      oldBooking.timeSlot,
      oldBooking.payment
    );

    // console.log(bookingUpdate);
    
    const updatedBooking = bookingUpdate.reschedule()
    this.bookingHistory.updateHistory(updatedBooking)
    // this.bookingHistory.getFullBookingHistory();
  }
}

const s1 = new Simulator();
s1.setRestaurant(30);
s1.simulateBooking("c1","b1", "2025-01-31", 20, "1 P.M.")
s1.simulateBooking("c2","b2", "2025-01-31", 5, "1 P.M.")
s1.simulateBooking("c2","b3", "2025-01-31", 5, "3 P.M.")
// s1.simulatecancel("b1"); 
// s1.simulateReschedule("c1", "b1", "2025-01-31", 5, "1 P.M.")
s1.simulateReschedule("c2", "b2", "2025-01-31", 8, "1 P.M.")

s1.simulateViewBooking('c2');

// s1.simulatecancel("b2"); 