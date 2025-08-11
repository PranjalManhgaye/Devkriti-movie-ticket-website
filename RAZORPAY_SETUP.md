# Razorpay Payment Gateway Integration

This guide explains how to set up and use the Razorpay payment gateway integration in your movie booking application.

## 🚀 Features Implemented

- ✅ Razorpay payment gateway integration
- ✅ Secure payment processing with signature verification
- ✅ Booking history with payment status tracking
- ✅ Real-time payment status updates
- ✅ Order ID tracking for each booking
- ✅ Responsive payment UI
- ✅ Error handling and user feedback

## 📋 Prerequisites

1. **Razorpay Account**: Sign up at [razorpay.com](https://razorpay.com)
2. **Node.js**: Version 14 or higher
3. **MongoDB**: Running instance
4. **React**: Version 18 or higher

## 🔧 Setup Instructions

### 1. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install razorpay
```

#### Environment Configuration
1. Copy `backend/config.env.example` to `backend/.env`
2. Update the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/movie-booking-app

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_your_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_secret_key_here

# Server Configuration
PORT=5000
NODE_ENV=development
```

#### Get Razorpay Keys
1. Log in to your Razorpay Dashboard
2. Go to Settings → API Keys
3. Generate a new key pair
4. Copy the Key ID and Key Secret to your `.env` file

### 2. Frontend Setup

#### Install Dependencies
```bash
npm install razorpay
```

#### Environment Configuration
1. Copy `frontend.env.example` to `.env`
2. Update the following variables:

```env
# Razorpay Configuration
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id_here

# API Configuration
VITE_API_URL=http://localhost:5000/api
```

### 3. Database Setup

The application will automatically create the necessary collections when you start the server. The Booking model includes:

- User ID and movie details
- Seat selection and showtime
- Payment status and Razorpay order details
- Booking history tracking

## 🔄 Payment Flow

### 1. User Journey
1. User selects movie and seats
2. Clicks "Pay & Confirm Booking"
3. Razorpay payment modal opens
4. User completes payment
5. Payment is verified on the server
6. Booking is saved with payment details
7. User sees confirmation page

### 2. Backend Process
1. **Create Order**: `/api/payments/create-order`
   - Validates booking details
   - Creates Razorpay order
   - Saves pending booking to database

2. **Payment Verification**: `/api/payments/verify-payment`
   - Verifies payment signature
   - Updates booking status to 'completed'
   - Returns success response

3. **Booking History**: `/api/payments/bookings`
   - Retrieves user's booking history
   - Shows payment status and details

## 🛡️ Security Features

- **Signature Verification**: All payments are verified using Razorpay's signature
- **JWT Authentication**: All payment routes require valid authentication
- **Input Validation**: Server-side validation of all payment data
- **Error Handling**: Comprehensive error handling and user feedback

## 📱 API Endpoints

### Payment Routes
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify-payment` - Verify payment signature
- `GET /api/payments/bookings` - Get user's booking history
- `GET /api/payments/bookings/:bookingId` - Get specific booking details

### Request/Response Examples

#### Create Order
```javascript
// Request
{
  "amount": 500,
  "currency": "INR",
  "bookingDetails": {
    "movie": { "name": "Movie Title" },
    "seats": ["0-0", "0-1"],
    "showtime": "2:30 PM",
    "date": "2024-01-15",
    "total": 500,
    "bookingId": "BK-ABC123"
  }
}

// Response
{
  "orderId": "order_ABC123",
  "amount": 50000,
  "currency": "INR",
  "bookingId": "BK-ABC123"
}
```

#### Verify Payment
```javascript
// Request
{
  "razorpay_order_id": "order_ABC123",
  "razorpay_payment_id": "pay_XYZ789",
  "razorpay_signature": "signature_hash"
}

// Response
{
  "success": true,
  "message": "Payment verified successfully",
  "bookingId": "BK-ABC123",
  "paymentId": "pay_XYZ789"
}
```

## 🎨 UI Components

### Updated Components
- **Booking.jsx**: Integrated payment flow with loading states
- **Confirmation.jsx**: Enhanced with payment details
- **Profile.jsx**: Shows booking history with payment status

### New Components
- **PaymentService**: Handles all Razorpay interactions
- **Payment Routes**: Backend API for payment processing

## 🧪 Testing

### Test Mode
- Use Razorpay test keys for development
- Test card numbers available in Razorpay documentation
- All test payments are processed without actual charges

### Test Cards
- **Success**: 4111 1111 1111 1111
- **Failure**: 4000 0000 0000 0002
- **CVV**: Any 3 digits
- **Expiry**: Any future date

## 🚨 Error Handling

### Common Errors
1. **Payment Failed**: User sees error message and can retry
2. **Network Issues**: Automatic retry with user feedback
3. **Invalid Signature**: Server rejects payment and shows error
4. **Booking Not Found**: Graceful error handling with navigation

### Error Messages
- Payment processing errors
- Network connectivity issues
- Invalid payment data
- Booking verification failures

## 📊 Monitoring

### Payment Status Tracking
- **Pending**: Order created, payment not completed
- **Completed**: Payment successful, booking confirmed
- **Failed**: Payment failed, booking not confirmed

### Order Tracking
- Each booking has a unique Razorpay order ID
- Payment IDs are stored for transaction tracking
- Booking history shows all payment attempts

## 🔧 Troubleshooting

### Common Issues
1. **Payment Modal Not Opening**
   - Check Razorpay script loading
   - Verify API key configuration

2. **Payment Verification Failing**
   - Ensure correct secret key
   - Check signature verification logic

3. **Bookings Not Saving**
   - Verify MongoDB connection
   - Check JWT token validity

### Debug Steps
1. Check browser console for errors
2. Verify environment variables
3. Test API endpoints with Postman
4. Check server logs for errors

## 📈 Production Deployment

### Environment Variables
- Use production Razorpay keys
- Set secure JWT secret
- Configure production MongoDB URI

### Security Checklist
- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] CORS configured properly
- [ ] Rate limiting implemented
- [ ] Error logging configured

## 📞 Support

For issues related to:
- **Razorpay Integration**: Check Razorpay documentation
- **Application Logic**: Review this setup guide
- **Payment Processing**: Contact Razorpay support

## 🔄 Updates

Keep your dependencies updated:
```bash
# Backend
cd backend && npm update

# Frontend
npm update
```

---

**Note**: This integration is for educational purposes. For production use, ensure compliance with Razorpay's terms of service and implement additional security measures. 