
export class TimeSlot {
    constructor(private timeSlots: string[] = []) {
        this.timeSlots = ["11 A.M.",
            "12 P.M.",
            "1 P.M.",
            "2 P.M.",
            "3 P.M.",
            "7 P.M.",
            "8 P.M.",
            "9 P.M.",
            "10 P.M.",
            "11 P.M.",]

    }

    add(slot: string) {
        this.timeSlots.push(slot)
    }

    remove(slot: string) {
        this.timeSlots = this.timeSlots.filter(timeSlot => timeSlot != slot)
    }

    getTimeSlots(): string[] {
        return this.timeSlots;
    }


}
