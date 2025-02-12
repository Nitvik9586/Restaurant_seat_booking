import { Booking } from "./booking";
import { CreditCard } from "./creditCard";
import { Customer } from "./customer";
import { DebitCard } from "./debitcard";
import { Payment, PaymentType } from "./payment";
import { Restaurant } from "./restaurant";
import { Upi } from "./upi";

class Simulator {

    constructor(
        private restaurants: Restaurant[] = [],
        private customers: Customer[] = []
    ) {
    }

    addCustomer(cutomerId: string, name: string, contactNum: string, email: string): void {
        if (this.getCustomer(cutomerId)) {
            return;
        }

        const customer = new Customer(cutomerId, name, contactNum, email);
        this.customers.push(customer);
    }

    getCustomer(customerId: string): Customer {
        const customer = this.customers.find(customer => customer.getId() == customerId);
        return customer as Customer;
    }

    addRestaurant(restaurantId: string, name: string, address: string, totalSeat: number, pricePerSeat: number, cancelFeeRate: number): void {
        if (this.getRestaurant(restaurantId)) {
            return;
        }
        this.restaurants.push(new Restaurant(restaurantId, name, address, totalSeat, pricePerSeat, cancelFeeRate));
    }

    getRestaurant(restaurantId: string): Restaurant {

        const restaurant = this.restaurants.find(restaurant => restaurant.getId() == restaurantId);
        return restaurant as Restaurant;
    }

    simulateBooking(customerId: string, restaurantId: string, bookingDate: string, numOfSeat: number, timeSlot: string, payment: Payment) {
        const customer = this.getCustomer(customerId);

        const restaurant = this.getRestaurant(restaurantId);

        new Booking(customer, restaurant, bookingDate, numOfSeat, timeSlot, payment).confirm()
    }

    simulateCancel(customerId: string, bookingId: string) {
        const customer = this.getCustomer(customerId)

        const booking = customer.getBooking(bookingId);

        booking.cancel();
    }

    simulateReschedule(customerId: string,bookingId: string, newDate: string, newnumOfSeat: number, newTimeSlot: string) {
        const customer = this.getCustomer(customerId)

        const booking = customer.getBooking(bookingId);
        

        booking.reschedule(newDate, newnumOfSeat, newTimeSlot);
    }

    simulateViewBookings(customerId: string): void {
        const customer = this.getCustomer(customerId);
        customer.viewBookings();
    }

    simulateViewAllBooking() {
        console.log(this.customers);

    }

    // simulateViewBookingOfRestaurant(restaurantId: string) {
    //     let restaurantBookings: Booking[] = []
    //     this.customers.forEach(customer => {
    //         console.log(restaurantBookings, customer.getBookings().filter(booking => booking.getRestaurantId() == restaurantId))
    //     })
    // }
}

const s1 = new Simulator();
s1.addRestaurant("R1", "Jp", "xxxxx", 30, 10, 0.10);
s1.addRestaurant("R2", "Jp1", "yyyyyyy", 40, 20, 0.2);
s1.addCustomer('c1', "jayraj", "9738587203", "jayraj@gmail.com");
s1.addCustomer('c2', "nitvik", "9586764635", "nitvik@gmail.com");
// s1.getRestaurant().registerCustomer('c2', "jayraj", "9738587203", "jayraj@gmail.com");
// s1.getRestaurant().getSeatAvailability()
s1.simulateBooking('c1', "R1", "2025-02-15", 10, "1 P.M.", new CreditCard(56));
s1.simulateBooking('c1', "R2", "2025-02-15", 20, "1 P.M.", new CreditCard(56));
s1.simulateBooking('c2', "R1", "2025-02-15", 3, "1 P.M.", new CreditCard(56));
// s1.simulateBooking('c1',"R1", "2025-02-12", 1, "1 P.M.",PaymentType.UPI);
// s1.simulateBooking('c1', "2025-02-12", 10, "2 P.M.")
// s1.simulateBooking('c2', "2025-02-12", 5, "1 P.M.")
// s1.simulateBooking('c1', "2025-02-12", 10, "3 P.M.")
s1.simulateCancel("c1","b1")
// s1.simulateReschedule('c1', 'b1', "2025-02-17", 1, "2 P.M.")
// s1.simulateViewBookings("c1");
// s1.getRestaurant().showAvailableTimeSlots("2025-02-13",10);
// s1.simulateViewAllBooking()
// s1.simulateBooking("c2", "2025-02-12", 10, "1 P.M.")
// s1.simulateBooking("c2", "2025-02-13", 5, "1 P.M.")