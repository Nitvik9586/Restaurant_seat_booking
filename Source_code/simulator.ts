import { Restaurant } from "./restaurant";
import { Customer } from "./customer";
import { Booking } from "./booking";
import { Payment } from "./payment";
import { CreditCardPayment } from "./creditCard";
import { DebitCardPayment } from "./debitcard";
import { UPIPayment } from "./upi";

class Simulator {

    constructor(
        private restaurants: Restaurant[] = [],
        private customers: Customer[] = []
    ) { }

    addCustomer(cutomerId: string, name: string, contactNum: string, email: string): void {
        if (this.getCustomer(cutomerId)) {
            return;
        }

        const customer = new Customer(cutomerId, name, contactNum, email);
        this.customers.push(customer);
    }

    getCustomer(customerId: string): Customer {
        const customer = this.customers.find(customer => customer.id == customerId);
        return customer as Customer;
    }

    addRestaurant(restaurantId: string, name: string, address: string, totalSeat: number, pricePerSeat: number, cancelFeeRate: number): void {
        if (this.getRestaurant(restaurantId)) {
            return;
        }
        this.restaurants.push(new Restaurant(restaurantId, name, address, totalSeat, pricePerSeat, cancelFeeRate));
    }

    getRestaurant(restaurantId: string): Restaurant {

        const restaurant = this.restaurants.find(restaurant => restaurant.id == restaurantId);
        return restaurant as Restaurant;
    }

    simulateBooking(customerId: string, restaurantId: string, bookingDate: string, numOfSeat: number, timeSlot: string, payment: Payment): void {
        const customer = this.getCustomer(customerId);

        const restaurant = this.getRestaurant(restaurantId);

        new Booking(customer, restaurant, bookingDate, numOfSeat, timeSlot, payment).confirm()
    }

    simulateCancel(customerId: string, bookingId: string): void {
        const customer = this.getCustomer(customerId)

        const booking = customer.getBooking(bookingId);

        booking.cancel();
    }

    simulateReschedule(customerId: string, bookingId: string, newDate: string, newnumOfSeat: number, newTimeSlot: string): void {
        const customer = this.getCustomer(customerId)

        const booking = customer.getBooking(bookingId);


        booking.reschedule(newDate, newnumOfSeat, newTimeSlot);
    }

    simulateViewCustomersBooking(customerId: string): void {
        this.getCustomer(customerId).showBookings();
    }

    simulateViewRestaurantsBooking(restaurantId: string): void {
        const bookings: string[] = []
        this.customers.forEach(customer => {
            const matchedBookings = customer.getBookings().filter(booking => booking.restaurant.id == restaurantId);

            matchedBookings.forEach(booking => {
                bookings.push(`
    Customer: ${customer.name}${booking.getDetails()}`)
            });
        });

        if (bookings.length > 0) {
            console.log(`Bookings of ${this.getRestaurant(restaurantId).name}\n`)
            bookings.forEach(booking => {
                const index = bookings.indexOf(booking);
                console.log(`Booking ${index + 1}: ${booking}`)
            });
            return;
        }

        console.log(`${this.getRestaurant(restaurantId).name} has no bookings.`);
    }

}

const s1 = new Simulator();

s1.addRestaurant("R1", "Food Zone", "012, Ground floor, Alpha mall, Ahmedabad - 380005", 30, 10, 0.10);
s1.addRestaurant("R2", "Food Station", "115, first floor, Reliance mall, Ahmedabad - 380005", 40, 20, 0.20);

s1.addCustomer('C1', "Nitvik", "9586764635", "nitvik@gmail.com");
s1.addCustomer('C2', "Jayraj", "9738587203", "jayraj@gmail.com");

s1.simulateBooking('C1', "R1", "2025-02-15", 10, "1 P.M.", new UPIPayment('9586764635@ptyes'));
s1.simulateBooking('C1', "R2", "2025-02-16", 5, "2 P.M.", new CreditCardPayment('4568-7894-8945', '06/30', 897, 'Nitvik Gamit'));
s1.simulateBooking('C2', "R1", "2025-02-15", 10, "3 P.M.", new UPIPayment('8469637980@apl'));
s1.simulateBooking('C2', "R2", "2025-02-16", 15, "2 P.M.", new CreditCardPayment('8475-1254-4875', '08/32', 896, 'Jayraj Nakun'));

s1.simulateViewCustomersBooking('C1')
s1.simulateViewCustomersBooking('C2')

s1.simulateViewRestaurantsBooking('R1')
s1.simulateViewRestaurantsBooking('R2')