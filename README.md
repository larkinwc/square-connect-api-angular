# Square Connect API · Angular snippet

A small standalone Angular card-payment example. “Square Connect” is the legacy
name; new integrations use the [Web Payments SDK](https://developer.squareup.com/docs/web-payments/overview)
to tokenize cards and the [Payments API](https://developer.squareup.com/reference/square/payments-api/create-payment)
to charge them. No deprecated `SqPaymentForm`, Python backend, or Angular workspace included.

## Use in an Angular app

Requires Angular 20+; uses signal inputs, signal state, and `afterNextRender`
(browser-only SDK initialization, including in SSR apps).

1. Install Square's TypeScript definitions:
   ```sh
   npm install --save-dev @square/web-payments-sdk-types
   ```
2. Copy `payment.component.ts` and `payment.component.html` into your app.
3. Add the sandbox script from `index.html` to your app's `<head>`, before Angular
   boots. The types package does **not** load the SDK. Keep your own app shell.
4. Import `PaymentComponent` in your standalone parent component's `imports` and render:
   ```html
   <app-payment
     applicationId="REPLACE_ME_SANDBOX_APPLICATION_ID"
     locationId="REPLACE_ME_SANDBOX_LOCATION_ID"
   />
   ```
   Get both IDs from the [Square Developer Console](https://developer.squareup.com/apps).
   They are browser configuration; the **access token stays on the server**.
5. Implement the endpoint below, then run `ng serve` **in your Angular app**, not
   this snippet repository. Proxy `/api` to your backend if it runs on another port.

This example charges **$1.00 USD**. `card.tokenize()` includes buyer verification
(SCA); no separate `verifyBuyer()` call. Collect more billing contact information
for a real checkout, and supply the server's order amount/currency to tokenization.
Keep the SDK IDs stable for the lifetime of the component.

## Backend contract

`POST /api/payments` receives:

```json
{ "sourceId": "TOKEN_FROM_SQUARE", "idempotencyKey": "UUID" }
```

Your backend must call Square `CreatePayment` with `source_id`, `idempotency_key`,
`amount_money: { amount: 100, currency: "USD" }`, and the same `location_id` used
by the component. Authenticate with your **sandbox access token on the server**.
Return `200` with `{ "status": "COMPLETED" }` only when Square reports completion;
return a non-2xx response on failure. Tokenization alone does not charge a card.

For production, authenticate the checkout and derive the order, total, currency,
and seller location server-side; never trust browser-supplied prices or secrets.
Persist an idempotency key per order/payment attempt and reconcile an uncertain
result before retrying. This minimal snippet creates a new key per submission;
it is not an order/retry system. An HTTP/network failure does not prove that a
charge failed. See Square's [server quickstart](https://developer.squareup.com/docs/web-payments/quickstart).

## Sandbox and production

Use `http://localhost` for development, HTTPS for deployment, and Square's
[Content Security Policy requirements](https://developer.squareup.com/docs/web-payments/content-security-policy).
Test with `4111 1111 1111 1111`, CVV `111`, a future expiry, and US postal code
`94103`; use only [sandbox test cards](https://developer.squareup.com/docs/devtools/sandbox/payments).

For production, switch the script to `https://web.squarecdn.com/v1/square.js` and
switch the application ID, seller location, backend API environment, and server
access token together. **Production payments charge real cards.**

## Verification

Compiled in a disposable Angular 22.2.1 app. Browser smoke checks used controlled
SDK/backend responses for tokenization errors, cancellation, payment failure,
pending/completed status, and component teardown. The real sandbox SDK loaded on
`localhost` and rejected placeholder IDs; no end-to-end Square charge was run.
