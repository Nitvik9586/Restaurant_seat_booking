import { Customer } from "./customer";
import { PaymentType } from "./payment";
import { Restaurant } from "./restaurant";

class Simulator {

    constructor(
        private restaurants: Restaurant[] = [],
        private customers: Customer[] = []
    ) {
    }

    addCustomer(cutomerId: string, name: string, contactNum: string, email: string):void {
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
    
    addRestaurant(restaurantId: string,name: string,address: string,totalSeat: number): void {
        if (this.getRestaurant(restaurantId)) {
            return;
        }
        this.restaurants.push( new Restaurant(restaurantId,name,address,totalSeat));
    }

    getRestaurant(restaurantId:string): Restaurant {
        
        const restaurant = this.restaurants.find(restaurant => restaurant.getId() == restaurantId);
        return restaurant as Restaurant;
    }

    simulateBooking(customerId: string,restaurantId: string, bookingDate: string, numOfSeat: number, timeSlot: string, paymentType: PaymentType) {
        const customer = this.getCustomer(customerId);

        const restaurant = this.getRestaurant(restaurantId);

        customer.bookSeat(restaurant, bookingDate, timeSlot, numOfSeat, paymentType);
    }

    simulateCancel(customerId: string,restaurantId:string, bookingId: string) {
        const customer = this.getCustomer(customerId)
        const restaurant = this.getRestaurant(restaurantId)

        customer.cancleSeat(restaurant, bookingId)
    }

    simulateReschedule(customerId: string, restaurantId:string, bookingId: string, newDate: string, newnumOfSeat: number, newTimeSlot: string) {
        const customer = this.getCustomer(customerId)
        const restaurant = this.getRestaurant(restaurantId)

        customer.rescheduleSeat(restaurant, bookingId, newDate, newnumOfSeat, newTimeSlot)
    }

    simulateViewBookings(customerId: string): void {
        const customer = this.getCustomer(customerId);
        customer.viewBookings();
    }



}

// const s1 = new Simulator();
// s1.setRestaurant(30)
// s1.getRestaurant().registerCustomer('c1', "nitvik", "9586764635", "nitvik@gmail.com");
// s1.getRestaurant().registerCustomer('c2', "jayraj", "9738587203", "jayraj@gmail.com");
// s1.getRestaurant().getSeatAvailability()
// s1.simulateBooking('c1', "2025-02-12", 10, "1 P.M.");
// s1.simulateBooking('c1', "2025-02-12", 10, "2 P.M.")
// s1.simulateBooking('c2', "2025-02-12", 5, "1 P.M.")
// s1.simulateBooking('c1', "2025-02-12", 10, "3 P.M.")
// s1.simulateCancel("c1", "b1")
// s1.simulateReschedule('c1', 'b1', "2025-02-12", 15, "1 P.M.")
// s1.simulateViewBookings();
// s1.getRestaurant().showAvailableTimeSlots("2025-02-13",10);

// s1.simulateBooking("c2", "2025-02-12", 10, "1 P.M.")
// s1.simulateBooking("c2", "2025-02-13", 5, "1 P.M.")