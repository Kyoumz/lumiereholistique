import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe } from '@stripe/stripe-js';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  private stripePromise = loadStripe('pk_test_51RbebGC8TqH2Jc3TC6NxsCtYs6ZYoLbVEEHToFITgjJAKV2hOQotQie3RgxOFee3YdJhdSkiFpAAYWcD6EtRUXEz00YEStL388');

  constructor(private http: HttpClient) {}

  async checkout(formationId: number) {
    const stripe = await this.stripePromise;

    if (!stripe) {
      alert('Le paiement est temporairement indisponible.');
      return;
    }

    this.http.post<{ id: string }>('http://localhost:5000/create-checkout-session', { formationId })
      .subscribe({
        next: async (session) => {
          const result = await stripe.redirectToCheckout({ sessionId: session.id });
          if (result?.error) {
            alert(`Erreur Stripe: ${result.error.message}`);
          }
        },
        error: () => {
          alert('Erreur lors de la création de la session de paiement.');
        }
      });
  }
}
