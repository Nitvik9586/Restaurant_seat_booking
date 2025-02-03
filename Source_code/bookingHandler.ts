import { Restaurant } from "./restaurant";
import { Booking } from "./booking";
import { Customer } from "./customer";

export class BookingHandler {
    private bookingCount: number = 1;

    constructor(private restaurant: Restaurant) { }

    private generateBookingId(): string {
        return `b${this.bookingCount}`;
    }

    createBooking(customer: Customer, bookingDate: string, numOfPerson: number, timeSlot: string): void {
        if (!this.restaurant.isSeatsAvailable(bookingDate, timeSlot, numOfPerson)) {
            console.log("Not enough seats available.");
            return;
        }

        const bookingId = this.generateBookingId();
        const booking = new Booking(customer.getId(), bookingId, bookingDate, numOfPerson, timeSlot);

        if (!booking.confirm()) {
            console.log("Booking failed due to payment issues.");
            return;
        }

        this.restaurant.removeSeatsAvailability(bookingDate, timeSlot, numOfPerson);
        customer.addBooking(booking);
        console.log(booking)
        this.bookingCount++;
    }

    cancelBooking(customer: Customer, bookingId: string): void {
        const booking = customer.getBookingById(bookingId);
        if (!booking) {
            console.log("Booking not found.");
            return;
        }

        booking.cancel();
        this.restaurant.addSeatsAvailability(booking.getDate(), booking.getTimeSlot(), booking.getNumOfPerson());
        // customer.viewBookings()
        // console.log(booking);
        
    }

    rescheduleBooking(customer: Customer, bookingId: string, newDate: string, newNumOfPerson: number, newTimeSlot: string): void {
        const booking = customer.getBookingById(bookingId);
        if (!booking) return;

        const isSameDateTime = booking.checkSameDateAndTime(newDate, newTimeSlot);
        if (isSameDateTime) {
            this.restaurant.addSeatsAvailability(newDate, newTimeSlot, booking.getNumOfPerson());
        }

        if (!this.restaurant.isSeatsAvailable(newDate, newTimeSlot, newNumOfPerson)) {
            if (isSameDateTime) {
                this.restaurant.removeSeatsAvailability(newDate, newTimeSlot, booking.getNumOfPerson());
            }
            return;
        }

        if (!booking.reschedule(newDate, newNumOfPerson, newTimeSlot)) {
            if (isSameDateTime) {
                this.restaurant.removeSeatsAvailability(newDate, newTimeSlot, booking.getNumOfPerson());
            }
            return;
        }

        this.restaurant.removeSeatsAvailability(newDate, newTimeSlot, newNumOfPerson);
        if (!isSameDateTime) {
            this.restaurant.addSeatsAvailability(booking.getDate(), booking.getTimeSlot(), booking.getNumOfPerson());
        }

        console.log(booking)
        return;
    }
}
