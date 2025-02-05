import { Restaurant } from "./restaurant";

class Simulator {

    constructor(
        private restaurant: Restaurant = new Restaurant(),
    ) {
    }

    getRestaurant(): Restaurant {
        return this.restaurant;
    }

    setRestaurant(totalSeat: number): void {
        this.restaurant = new Restaurant(totalSeat);
    }

    simulateBooking(customerId: string, bookingDate: string, numOfSeat: number, timeSlot: string) {
        this.restaurant.bookSeat(customerId, bookingDate, timeSlot, numOfSeat)
    }

    simulateCancel(customerId: string, bookingId: string) {
        this.restaurant.cancleSeat(customerId, bookingId)
    }

    simulateReschedule(customerId: string, bookingId: string, newDate: string, newnumOfSeat: number, newTimeSlot: string) {
        this.restaurant.rescheduleSeat(customerId,bookingId,newDate, newnumOfSeat,newTimeSlot)
    }

    simulateViewBookings(): void {
        this.restaurant.viewCustomersBookings();
    }

}

const s1 = new Simulator();
s1.setRestaurant(30)
s1.getRestaurant().registerCustomer('c1', "nitvik", "+86385872", "nitvik@gmail.com");
s1.getRestaurant().registerCustomer('c2', "jayraj", "97385872", "jayraj@gmail.com");

s1.simulateBooking('c1', "2025-02-10", 10, "1 P.M.");
// s1.simulateBooking('c1', "2025-02-10", 10, "2 P.M.")
// s1.simulateBooking('c2', "2025-02-10", 5, "1 P.M.")
// s1.simulateBooking('c1', "2025-02-10", 10, "3 P.M.")
s1.simulateReschedule('c1', 'b0', "2025-02-11", 150, "2 P.M.")
s1.getRestaurant().showAvailableSeat("2025-02-11",1);
// s1.simulateCancel("c1", "b1")
s1.simulateViewBookings();

// s1.simulateBooking("c2", "2025-02-07", 10, "1 P.M.")
// s1.simulateBooking("c2", "2025-02-10", 5, "1 P.M.")