import { Restaurant } from "./restaurant";
import { CustomerManager } from "./customerManager";
import { Booking } from "./booking";
import { Customer } from "./customer";

class Simulator {
  constructor(
    private restaurant: Restaurant = new Restaurant(),
    private customerManager: CustomerManager = new CustomerManager(),
    private bookingCount: number = 1
  ) { }

  setRestaurant(totalSeat: number): void {
    this.restaurant = new Restaurant(totalSeat);
  }

  CustomerManager(): CustomerManager {
    return this.customerManager;
  }

  simulateBooking(customerId: string, bookingDate: string, numOfPerson: number, timeSlot: string) {
    const customer = this.customerManager.getCustomer(customerId);
    
    if (!customer) return;
    console.log(`Booking started by customer with id ${customerId}.\n `);
    
    const isSeatAvailable = this.restaurant.isSeatsAvalible(bookingDate, timeSlot, numOfPerson);
    if (!isSeatAvailable) return;

    const bookingId = `b${this.bookingCount}`;

    const booking = new Booking(customerId, bookingId, bookingDate, numOfPerson, timeSlot);

    const isBookingConfirmed = booking.confirm();
    
    if (!isBookingConfirmed) return;

    customer.addBooking(booking);
    this.bookingCount++;
    this.restaurant.removeSeatsAvailability(bookingDate, timeSlot, numOfPerson);
    // this.customerManager.viewCustomers();
    // this.customer.getFullBookingHistory();
    // this.restaurant.getSeatAvaibility();

  }

  simulateViewBooking(customerId: string) {
    const customer = this.customerManager.getCustomer(customerId);

    if (!customer) return;

    customer.viewBookings();
  }

  simulatecancel(customerId: string, bookingId: string): void {
    const customer = this.customerManager.getCustomer(customerId)

    if (!customer) return;
    console.log(`Booking cancelation started by customer with id ${customerId}.\n `);

    const booking = customer.getBookingById(bookingId);

    console.log(`Cancelation started for booking ID ${bookingId}.\n `);

    if (!booking) return;

    booking.cancel();

    this.restaurant.addSeatsAvailability(booking.getDate(), booking.getTimeSlot(), booking.getNumOfPerson());

    customer.updateBooking(booking);
  }

  simulateReschedule(customerId: string, bookingId: string, bookingDate: string, numOfPerson: number, timeSlot: string) {
    const customer = this.customerManager.getCustomer(customerId);

    if (!customer) return;
    console.log(`Reschedule process started by customer with ID ${customerId}.\n`)

    const oldBooking = customer.getBookingById(bookingId);
    
    if (!oldBooking) return;
    console.log(`Reschedule for booking ID ${bookingId} is started.`);

    const isSameBookingDateAndTime = oldBooking.checkSameDateAndTime(bookingDate, timeSlot)

    if (isSameBookingDateAndTime) {
      this.restaurant.addSeatsAvailability(bookingDate, timeSlot, oldBooking.getNumOfPerson())
    }

    const isSeatAvailable = this.restaurant.isSeatsAvalible(bookingDate, timeSlot, numOfPerson);

    if (!isSeatAvailable) {
      if (isSameBookingDateAndTime) {
        this.restaurant.removeSeatsAvailability(bookingDate, timeSlot, oldBooking.getNumOfPerson())
      }
      return;
    }

    const isRescheduled = oldBooking.reschedule(bookingDate, numOfPerson, timeSlot);
    if (!isRescheduled) {
      this.restaurant.removeSeatsAvailability(bookingDate, timeSlot, oldBooking.getNumOfPerson())
      return
    };
    this.restaurant.removeSeatsAvailability(bookingDate, timeSlot, numOfPerson);

    if (!isSameBookingDateAndTime) {
      this.restaurant.addSeatsAvailability(oldBooking.getDate(), oldBooking.getTimeSlot(), oldBooking.getNumOfPerson())
    } 

    customer.updateBooking(oldBooking)
    // this.customerManager.viewCustomers();
    // customer.viewBookings();
    // this.restaurant.getSeatAvaibility()
  }
}

const s1 = new Simulator();
s1.setRestaurant(30);
s1.CustomerManager().addCustomer('c1');
s1.CustomerManager().addCustomer('c2');
s1.simulateBooking("c1", "2025-02-07", 20, "1 P.M.")
s1.simulateBooking("c1", "2025-02-07", 20, "2 P.M.")
s1.simulateBooking("c2", "2025-02-07", 10, "1 P.M.")
// s1.simulateBooking("c2", "b3", "2025-01-31", 5, "3 P.M.")

// s1.simulatecancel("c1", "b1");
// s1.simulatecancel("c2","b2"); 

// s1.simulateReschedule("c1", "b1", "2025-02-07", 5, "11 P.M.")
// s1.simulateReschedule("c1", "b1", "2025-02-01", 10, "1 P.M.")
// s1.simulateReschedule("c2", "b2", "2025-01-31", 8, "1 P.M.")

// s1.simulateViewBooking('c1')