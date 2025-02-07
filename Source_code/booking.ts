import { Payment, PaymentStatus, PaymentType } from "./payment";
import { Restaurant } from "./restaurant";

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  RESCHEDULE = "RESCHEDULED"
}

export class Booking {

  constructor(
    private customerId: string,
    private restaurantId: string,
    private id: string,
    private date: string,
    private numOfSeat: number,
    private timeSlot: string,
    private status: BookingStatus = BookingStatus.PENDING,
    private payment: Payment = new Payment(PaymentType.UPI)
  ) {
  }

  public getId(): string {
    return this.id
  }

  public getStatus(): BookingStatus {
    return this.status;
  }


  public confirm(restaurant: Restaurant, paymentType: PaymentType): void {
    console.log(`Proceed to pay ${this.payment.getAmount()}...\n`)

    this.payment.process(this.payment.getAmount());

    if (this.payment.getStatus() == PaymentStatus.PAID) {
      this.status = BookingStatus.CONFIRMED;

      console.log(`Your booking is confirmed and Booking ID is ${this.id}.\n`);

      restaurant.removeSeatsAvailability(this.date, this.timeSlot, this.numOfSeat);
      return;
    }

    console.log(`Booking can not be done due to failed payment.\n
      ================================================================\n`);
    return;
  }

  public cancel(restaurant: Restaurant): void {

    const cancellationCharge = this.payment.getAmount() * restaurant.getCancelFeeRate();

    const refundAmount = this.payment.getAmount() - cancellationCharge;

    console.log(`Cancelation charges is ${cancellationCharge}.`);

    this.payment.refund(refundAmount);

    if (this.payment.getStatus() == PaymentStatus.REFUNDED) {
      this.status = BookingStatus.CANCELLED;

      console.log("Your booking is cancelled. \n ");

      restaurant.addSeatsAvailability(this.date, this.timeSlot, this.numOfSeat);
      return;
    }

    console.log("Your booking cancelation failed due to some issue.\n ");
    return;
  }

  public reschedule(restaurant: Restaurant, newDate: string, newnumOfSeat: number, newTimeSlot: string): void {

    if (this.status == BookingStatus.CANCELLED) {
      console.log("Cancelled booking can not be rescheduled.\n");
      return;
    }

    const isSameDateTime = (this.date == newDate && this.timeSlot == newTimeSlot) ? true : false;

    if (isSameDateTime) {
      restaurant.addSeatsAvailability(newDate, newTimeSlot, this.numOfSeat);
    }

    if (restaurant.isSeatsAvailable(newDate, newTimeSlot, newnumOfSeat)) {
      const seatsToReschedule = newnumOfSeat - this.numOfSeat;
      const diffInAmount = (seatsToReschedule) * restaurant.getPricePerSeat();

      let totalAmount = this.payment.getAmount();

      if (seatsToReschedule > 0) {
        const isPaymentDone = this.payment.process(diffInAmount);

        if (!isPaymentDone) return;

        totalAmount = newnumOfSeat * restaurant.getPricePerSeat();
      } else if (seatsToReschedule < 0) {
        this.payment.refund(-diffInAmount);

        totalAmount = this.payment.getAmount() + diffInAmount;
        this.payment.setStatus(PaymentStatus.PAID);
      }

      restaurant.removeSeatsAvailability(newDate, newTimeSlot, newnumOfSeat);

      if (!isSameDateTime) {
        restaurant.addSeatsAvailability(this.date, this.timeSlot, this.numOfSeat)
      }

      this.date = newDate;
      this.numOfSeat = newnumOfSeat;
      this.timeSlot = newTimeSlot;
      this.payment.setAmount(totalAmount);
      this.status = BookingStatus.RESCHEDULE;

      console.log(`Your booking is Reschedulled.\n==========================================\n`);
      return;
    }

    if (isSameDateTime) {
      restaurant.removeSeatsAvailability(newDate, newTimeSlot, this.numOfSeat);
    }

    console.log('Reschedule is failed.\n Please re-try.');
  }
}