import { Restaurant } from "./restaurant";
import {  Customer } from "./customer";
import { Booking } from "./booking";
import { Payment } from "./payment";

class Simulator {
  constructor(
    private restaurant: Restaurant = new Restaurant(),
    private customer: Customer = new Customer(),
  ) { }

  setRestaurant(totalSeat: number): void {
    this.restaurant = new Restaurant(totalSeat);
  }

  createCustomer(customerId: string){
    this.customer = new Customer(customerId);
  }

  simulateBooking(customerId: string, bookingId: string, bookingDate: string, numOfPerson: number, timeSlot: string) {

    const isSeatAvailable = this.restaurant.isSeatsAvalible(bookingDate, timeSlot, numOfPerson);
    if (!isSeatAvailable) return;
    
    const booking = new Booking(customerId, bookingId, bookingDate, numOfPerson, timeSlot)
    booking.confirm();

    this.customer.addBookingHistory(booking);
    
    this.restaurant.removeSeatsAvailability(bookingDate, timeSlot, numOfPerson);
    this.customer.getFullBookingHistory();

  }

  // simulateViewBooking(customerId: string): void {
  //   const bookings = this.customer.getFullBookingHistory(customerId);
  //   console.log('Bookings = ', bookings);
  // }

  simulatecancel(customerId: string, bookingId: string): void {
    const booking = this.customer.getBookingHistroy(customerId, bookingId);

    console.log(booking);
    
    if (!booking) return;

    booking.cancel();
    

    this.restaurant.addSeatsAvailability(booking.getDate(), booking.getTimeSlot(), booking.getNumOfPerson());

    this.customer.updateHistory(booking);
  }

  simulateReschedule(customerId: string, bookingId: string, bookingDate: string, numOfPerson: number, timeSlot: string) {
    const oldBooking = this.customer.getBookingHistroy(customerId, bookingId);

    if (!oldBooking) return;
    const isSameBookingDateAndTime = oldBooking.checkSameDateAndTime(bookingDate, timeSlot)
    if (isSameBookingDateAndTime) {
      this.restaurant.addSeatsAvailability(bookingDate, timeSlot, oldBooking.getNumOfPerson())
    }
    
    const isSeatAvailable = this.restaurant.isSeatsAvalible(bookingDate, timeSlot, numOfPerson);
    
    if (!isSeatAvailable) {
      console.log(`Reschedule for seats ${numOfPerson} is not available for date ${bookingDate} and time slot ${timeSlot}.`);
      if (oldBooking.getDate() == bookingDate && oldBooking.getTimeSlot() == timeSlot) {
        this.restaurant.removeAvailability(bookingDate, timeSlot, oldBooking.numOfPerson)
      }
      return;
    }
    
    oldBooking.reschedule(bookingDate, numOfPerson, timeSlot);
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
    this.customer.updateHistory(updatedBooking)
    // this.customer.getFullBookingHistory();
  }
}

const s1 = new Simulator();
s1.setRestaurant(30);
s1.createCustomer('c1')
s1.simulateBooking("c1", "b1", "2025-01-31", 20, "1 P.M.")
// s1.createCustomer('c2')
s1.simulateBooking("c2", "b2", "2025-01-31", 5, "1 P.M.")
// s1.simulateBooking("c2", "b3", "2025-01-31", 5, "3 P.M.") 
s1.simulatecancel("c1","b1");  
s1.simulatecancel("c2","b2"); 
// s1.simulateReschedule("c1", "b1", "2025-01-31", 5, "1 P.M.")
// s1.simulateReschedule("c2", "b2", "2025-01-31", 8, "1 P.M.")

// s1.simulateViewBooking('c2');

// s1.simulatecancel("b2"); 