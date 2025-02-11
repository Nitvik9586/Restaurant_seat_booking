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
    
    addRestaurant(restaurantId: string,name: string,address: string,totalSeat: number,pricePerSeat:number): void {
        if (this.getRestaurant(restaurantId)) {
            return;
        }
        this.restaurants.push( new Restaurant(restaurantId,name,address,totalSeat,pricePerSeat));
    }

    getRestaurant(restaurantId:string): Restaurant {
        
        const restaurant = this.restaurants.find(restaurant => restaurant.getId() == restaurantId);
        return restaurant as Restaurant;
    }

    simulateBooking(customerId: string, restaurantId: string, bookingDate: string, numOfSeat: number, timeSlot: string, payment: Payment, p0: void) {
        const customer = this.getCustomer(customerId);

        const restaurant = this.getRestaurant(restaurantId);
        // const payment = new Payment(paymentType,numOfSeat)
        // let payment:Payment;        

        customer.bookSeat(restaurant, bookingDate, timeSlot, numOfSeat, payment);
        
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

    simulateViewAllBooking(){
        console.log(this.customers);
        
    }

}

const s1 = new Simulator();
s1.addRestaurant("R1","Jp","xxxxx",30,10);
s1.addRestaurant("R2","Jp1","yyyyyyy",40,100);
s1.addCustomer('c1', "jayraj", "9738587203", "jayraj@gmail.com");
s1.addCustomer('c2', "nitvik", "9586764635", "nitvik@gmail.com");
// s1.getRestaurant().registerCustomer('c2', "jayraj", "9738587203", "jayraj@gmail.com");
// s1.getRestaurant().getSeatAvailability()
s1.simulateBooking('c1',"R1", "2025-02-12", 10, "1 P.M.",new Upi("U56"));
s1.simulateBooking('c1',"R2", "2025-02-12", 20, "1 P.M.",new CreditCard(56));
s1.simulateBooking('c2',"R1", "2025-02-12", 3, "1 P.M.",new DebitCard(555));
// s1.simulateBooking('c1',"R1", "2025-02-12", 1, "1 P.M.",PaymentType.UPI);
// s1.simulateBooking('c1', "2025-02-12", 10, "2 P.M.")
// s1.simulateBooking('c2', "2025-02-12", 5, "1 P.M.")
// s1.simulateBooking('c1', "2025-02-12", 10, "3 P.M.")
// s1.simulateCancel("c1","R1","b1")
s1.simulateReschedule('c1',"R1",'b1', "2025-02-12", 15, "2 P.M.")
// s1.simulateViewBookings("c1");
// s1.getRestaurant().showAvailableTimeSlots("2025-02-13",10);
// s1.simulateViewAllBooking()
// s1.simulateBooking("c2", "2025-02-12", 10, "1 P.M.")
// s1.simulateBooking("c2", "2025-02-13", 5, "1 P.M.")