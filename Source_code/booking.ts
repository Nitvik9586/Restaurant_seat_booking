import { Customer } from "./customer";
import { Payment } from "./payment";

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELED = "CANCELLED",
  RESCHEDULE = "RESCHEDULED"
}

export class Booking  {
  constructor(
    private customerId: string,
    private id: string,
    private date: string,
    private numOfPerson: number,
    private timeSlot: string,
    private status: BookingStatus = BookingStatus.PENDING,
    private payment: Payment = new Payment()
  ) { this.payment = new Payment(this.numOfPerson * 10)}

  public getId(): string {
    return this.id
  }
  
  public confirm(): void {
    console.log(`Proceed to pay ${this.payment.getAmount()}...\n`)
    const isPaymentDone = this.payment.process();

    if (!isPaymentDone) {
      console.log(`Booking can not be done due to failed payment.\n
================================================================\n`);
      return;
    }

    this.status = BookingStatus.CONFIRMED;
    //   customerId: this.customerId,
    //   id: this.id,
    //   date: this.date,
    //   numOfPerson: this.numOfPerson,
    //   timeSlot: this.timeSlot,
    //   status: this.status,
    //   payment: this.payment,
    // };

    console.log(`Your booking is confirmed.\n
==========================================\n`);
  }

  public cancel(): void {

    this.payment.refund()
    this.status = BookingStatus.CANCELED;

    console.log(`Your booking is cancelled.
      \n==========================================\n`);
      
  }

  getCustomerId(){
    return this.customerId
  }

  getDate(){
    return this.date;
  }

  getTimeSlot(){
    return this.timeSlot;
  }

  getNumOfPerson(){
    return this.numOfPerson;
  }


  checkSameDateAndTime(bookingDate:string, timeSlot:string):boolean{
    if (this.date == bookingDate && this.timeSlot == timeSlot) {
      return true;
    }
    return false;
  }
  
  public reschedule(bookingDate: string, numOfPerson: number, timeSlot: string): void {
    if (this.status == "CANCELLED") {
      console.log("Your Booking is already cancelled You can't reschedule it.\n");
      return;
    }



    this.status = BookingStatus.RESCHEDULE;


    const booking = {
      customerId: this.customerId,
      id: this.id,
      date: this.date,
      numOfPerson: this.numOfPerson,
      timeSlot: this.timeSlot,
      status: this.status,
      payment: this.payment,
    };

    console.log(`Your booking is Reschedulled.\n
==========================================\n`);
    
  }
}

