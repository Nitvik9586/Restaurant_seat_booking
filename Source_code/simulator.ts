import { Restaurant } from "./restaurant";
import { CustomerManager } from "./customerHandler";
import { BookingHandler } from "./bookingHandler";

class Simulator {
    private bookingHandler: BookingHandler;

    constructor(
        private restaurant: Restaurant = new Restaurant(),
        private customerManager: CustomerManager = new CustomerManager()
    ) {
        this.bookingHandler = new BookingHandler(this.restaurant);
    }

    setRestaurant(totalSeat: number): void {
        this.restaurant = new Restaurant(totalSeat);
        this.bookingHandler = new BookingHandler(this.restaurant);
    }

    getCustomerManager(): CustomerManager {
        return this.customerManager;
    }

    simulateBooking(customerId: string, bookingDate: string, numOfPerson: number, timeSlot: string) {
        const customer = this.customerManager.getCustomer(customerId);
        if (!customer) return;

        console.log(`Booking started by customer with ID ${customerId}.\n`);
        this.bookingHandler.createBooking(customer, bookingDate, numOfPerson, timeSlot);
    }

    simulateCancel(customerId: string, bookingId: string) {
        const customer = this.customerManager.getCustomer(customerId);
        if (!customer) return;

        console.log(`Cancelling booking with ID ${bookingId}...`);
        this.bookingHandler.cancelBooking(customer, bookingId);
    }

    simulateReschedule(customerId: string, bookingId: string, newDate: string, newNumOfPerson: number, newTimeSlot: string) {
        const customer = this.customerManager.getCustomer(customerId);
        if (!customer) return;

        console.log(`Rescheduling booking ${bookingId}...`);
        this.bookingHandler.rescheduleBooking(customer, bookingId, newDate, newNumOfPerson, newTimeSlot);
    }
}

const s1 = new Simulator();
s1.setRestaurant(30);
s1.getCustomerManager().addCustomer('c1');
s1.getCustomerManager().addCustomer('c2');
s1.simulateBooking("c1", "2025-02-10", 10, "1 P.M.")
s1.simulateBooking("c1", "2025-02-10", 5, "1 P.M.")
// s1.simulateBooking("c2", "2025-02-07", 10, "1 P.M.")

s1.simulateCancel("c1", "b1")
s1.simulateReschedule('c1', 'b2', "2025-02-10", 15, "1 P.M.")
// s1.getCustomerManager().viewCustomers();