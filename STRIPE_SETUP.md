# Stripe Payment Integration Setup Guide

This guide will help you set up Stripe payment integration for your application.

## Prerequisites

1. A Stripe account (sign up at https://stripe.com)
2. Access to your Stripe Dashboard

## Step 1: Get Your Stripe API Keys

1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **API keys**
3. You'll see two keys:
   - **Publishable key** (starts with `pk_test_` for test mode or `pk_live_` for live mode)
   - **Secret key** (starts with `sk_test_` for test mode or `sk_live_` for live mode)

## Step 2: Configure Backend

1. Open `challengeApp/src/main/resources/application.properties`
2. Replace the placeholder values with your actual Stripe keys:

```properties
# Stripe Configuration
stripe.secret.key=sk_test_your_actual_secret_key_here
stripe.public.key=pk_test_your_actual_public_key_here
```

**Important:** 
- For development, use test keys (starting with `sk_test_` and `pk_test_`)
- Never commit your secret keys to version control
- For production, use environment variables instead of hardcoding keys

## Step 3: Configure Frontend

1. Open `frontend/src/pages/PaymentPage.jsx`
2. Find the line near the top:
   ```javascript
   const stripePromise = loadStripe('pk_test_your_public_key_here');
   ```
3. Replace `pk_test_your_public_key_here` with your actual Stripe publishable key

## Step 4: Install Dependencies

### Backend
The Stripe Java SDK dependency has been added to `pom.xml`. Run:
```bash
cd challengeApp
mvn clean install
```

### Frontend
The Stripe React libraries have been added to `package.json`. Run:
```bash
cd frontend
npm install
```

## Step 5: Test the Integration

### Test Card Numbers (Test Mode Only)

Stripe provides test card numbers for testing:

- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- **Requires Authentication:** `4000 0025 0000 3155`

For all test cards:
- Use any future expiration date (e.g., 12/25)
- Use any 3-digit CVC (e.g., 123)
- Use any postal code

### Testing Flow

1. Start your backend server:
   ```bash
   cd challengeApp
   mvn spring-boot:run
   ```

2. Start your frontend server:
   ```bash
   cd frontend
   npm run dev
   ```

3. Add items to cart and proceed to checkout
4. For orders over Rs 3000, Stripe payment will be required
5. Use a test card number to complete the payment

## API Endpoints

The following new endpoints have been added:

### Create Payment Intent
```
POST /api/payments/create-payment-intent
Body: {
  "amount": 5000,
  "currency": "usd",
  "description": "Order payment"
}
```

### Confirm Payment
```
POST /api/payments/confirm-payment
Body: {
  "paymentIntentId": "pi_xxx"
}
```

### Get Payment Intent Status
```
GET /api/payments/payment-intent/{paymentIntentId}
```

### Create Stripe Payment Record
```
POST /api/payments/stripe-payment
Body: {
  "paymentIntentId": "pi_xxx",
  "recipientName": "John Doe",
  "amount": 5000,
  "address": "123 Main St",
  "city": "City",
  "postalCode": "12345"
}
```

## Payment Flow

1. User proceeds to checkout
2. Frontend creates a payment intent via backend API
3. Backend creates a Stripe PaymentIntent and returns client secret
4. User enters card details using Stripe Elements
5. Frontend confirms payment with Stripe
6. On success, backend creates payment and order records
7. User is redirected to order confirmation page

## Security Notes

1. **Never expose your secret key** in frontend code
2. Always use HTTPS in production
3. Validate payment status on the backend before fulfilling orders
4. Use webhooks to handle asynchronous payment events (recommended for production)
5. Store sensitive keys in environment variables, not in code

## Troubleshooting

### Payment Intent Creation Fails
- Verify your Stripe secret key is correct
- Check that the amount is in the smallest currency unit (cents for USD)
- Ensure your Stripe account is activated

### Frontend Stripe Elements Not Loading
- Verify your publishable key is correct
- Check browser console for errors
- Ensure `@stripe/stripe-js` and `@stripe/react-stripe-js` are installed

### Payment Confirmation Fails
- Verify the payment intent ID matches
- Check that the card details are valid (for test mode, use test cards)
- Review Stripe Dashboard logs for detailed error messages

## Going Live

When ready for production:

1. Switch to live mode in Stripe Dashboard
2. Get your live API keys
3. Update `application.properties` with live secret key
4. Update `PaymentPage.jsx` with live publishable key
5. Test thoroughly with real cards in small amounts first
6. Set up webhooks for production payment events
7. Implement proper error handling and logging

## Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe React Elements](https://stripe.com/docs/stripe-js/react)
- [Stripe Java SDK](https://github.com/stripe/stripe-java)
- [Stripe Testing](https://stripe.com/docs/testing)

