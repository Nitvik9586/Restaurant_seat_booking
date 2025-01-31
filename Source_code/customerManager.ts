import { Customer } from "./customer";

export class CustomerManager {
    constructor(private customers: Customer[] = []) { }

    addCustomer(cutomerId: string) {
        if (this.getCustomer(cutomerId)) {
            return;
        }

        const customer = new Customer(cutomerId);
        this.customers.push(customer);
    }

    getCustomer(customerId: string): Customer | undefined{
        const customer = this.customers.find(customer => customer.getId() == customerId) ;
        
        return customer ;
    }

    viewCustomers(): Customer[] {
        console.log(`Customers: \n`);

        this.customers.forEach(customer => {
            console.log(customer.viewBookings())
        });
        return this.customers;
    }

}