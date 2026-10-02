import { afterNextRender, Component, DestroyRef, ElementRef, inject, input, signal, viewChild } from '@angular/core';
import type { Card, Square } from '@square/web-payments-sdk-types';

declare global {
  interface Window { Square?: Square; }
}

@Component({
  selector: 'app-payment',
  standalone: true,
  templateUrl: './payment.component.html',
})
export class PaymentComponent {
  readonly applicationId = input.required<string>();
  readonly locationId = input.required<string>();
  readonly ready = signal(false);
  readonly busy = signal(false);
  readonly paid = signal(false);
  readonly message = signal('Loading payment form…');
  private readonly container = viewChild.required<ElementRef<HTMLDivElement>>('cardContainer');
  private readonly destroyRef = inject(DestroyRef);
  private card?: Card;

  constructor() {
    afterNextRender(() => { void this.initialize(); });
    this.destroyRef.onDestroy(() => { void this.card?.destroy(); });
  }

  private async initialize() {
    try {
      if (!window.Square) throw new Error('Square SDK failed to load.');
      const card = await window.Square.payments(this.applicationId(), this.locationId()).card();
      if (this.destroyRef.destroyed) {
        await card.destroy();
        return;
      }
      this.card = card;
      await card.attach(this.container().nativeElement);
      if (this.destroyRef.destroyed) return;
      this.ready.set(true);
      this.message.set('');
    } catch (error) {
      this.message.set(error instanceof Error ? error.message : 'Unable to load payment form.');
    }
  }

  async pay(email: string) {
    if (!this.card || !this.ready() || this.busy() || this.paid()) return;
    this.busy.set(true);
    this.message.set('');
    try {
      const result = await this.card.tokenize({
        amount: '1.00',
        currencyCode: 'USD',
        intent: 'CHARGE',
        billingContact: { email, countryCode: 'US' },
        customerInitiated: true,
        sellerKeyedIn: false,
      });
      if (result.status !== 'OK') {
        const errors = 'errors' in result ? result.errors : [];
        throw new Error(errors?.map(error => error.message).join('\n') || `Tokenization: ${result.status}`);
      }
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceId: result.token, idempotencyKey: crypto.randomUUID() }),
      });
      if (!response.ok) throw new Error('Payment not confirmed. Check your order before trying again.');
      const payment: { status: string } = await response.json();
      if (payment.status !== 'COMPLETED') throw new Error('Payment not completed. Check your order before trying again.');
      this.paid.set(true);
      this.message.set('Payment completed.');
    } catch (error) {
      this.message.set(error instanceof Error ? error.message : 'Payment not confirmed. Check your order before trying again.');
    } finally {
      this.busy.set(false);
    }
  }
}
