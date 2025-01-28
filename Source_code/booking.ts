import { Restaurant } from "./restaurant";

enum BookingStatus {
    PENDING= "PENDING",
    CONFIRMED= "CONFIRMED",
    CANCELED= "CANCELLED"
}

export class Booking{
    constructor(
        private bookingId:string,
        private bookingDate:string,
        private numOfPerson:number,
        private timeSlot:string,
        private Status:BookingStatus = BookingStatus.PENDING
    ){

    }

    private res = new Restaurant(30);
    public confirmBooking(){
        if (this.res.isAvalible(this.bookingDate,this.timeSlot,this.numOfPerson)) {

            console.log("Booking is done");
                        
        }
    }
    

}

