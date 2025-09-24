export interface IEmailServices {
    sendOrderConfirmation(orderId: string, customerEmail: string): Promise<void>;
}

export class EmailServices implements IEmailServices {
    public sentEmails: Array<{ orderId: string; customerEmail: string }> = [];

    async sendOrderConfirmation(orderId: string, customerEmail: string): Promise<void> {
        this.sentEmails.push({ orderId, customerEmail });
    }
}