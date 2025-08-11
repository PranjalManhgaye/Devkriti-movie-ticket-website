const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_ID';

class PaymentService {
  constructor() {
    this.razorpay = null;
    this.loadRazorpay();
  }

  loadRazorpay() {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        this.razorpay = window.Razorpay;
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        this.razorpay = window.Razorpay;
        resolve();
      };
      script.onerror = () => {
        reject(new Error('Failed to load Razorpay'));
      };
      document.body.appendChild(script);
    });
  }

  async createOrder(bookingDetails) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: bookingDetails.total,
          bookingDetails
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  // Test payment method (simulates payment without Razorpay)
  async createTestOrder(bookingDetails) {
    try {
      console.log('Sending test order request:', {
        amount: bookingDetails.total,
        bookingDetails
      });

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/payments/create-test-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: bookingDetails.total,
          bookingDetails
        })
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error response:', errorData);
        throw new Error(errorData.message || 'Failed to create test order');
      }

      const result = await response.json();
      console.log('Test order successful:', result);
      return result;
    } catch (error) {
      console.error('Error creating test order:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  async initiatePayment(orderData, bookingDetails) {
    try {
      await this.loadRazorpay();

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'MovieHub',
        description: `Booking for ${bookingDetails.movie.name}`,
        order_id: orderData.orderId,
        handler: async (response) => {
          try {
            await this.verifyPayment(response);
            return {
              success: true,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id
            };
          } catch (error) {
            console.error('Payment verification failed:', error);
            throw error;
          }
        },
        prefill: {
          email: localStorage.getItem('email') || '',
        },
        theme: {
          color: '#f72585'
        },
        modal: {
          ondismiss: () => {
            console.log('Payment modal dismissed');
          }
        }
      };

      const paymentObject = new this.razorpay(options);
      paymentObject.open();

      return new Promise((resolve, reject) => {
        paymentObject.on('payment.failed', (response) => {
          reject(new Error('Payment failed'));
        });
        
        paymentObject.on('payment.cancel', () => {
          reject(new Error('Payment cancelled'));
        });
      });

    } catch (error) {
      console.error('Error initiating payment:', error);
      throw error;
    }
  }

  async verifyPayment(paymentResponse) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/payments/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature
        })
      });

      if (!response.ok) {
        throw new Error('Payment verification failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  }

  async getBookingHistory() {
    try {
      const token = localStorage.getItem('token');
      console.log('Token for booking history:', token ? 'Present' : 'Missing');
      
      const response = await fetch('http://localhost:5000/api/payments/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Booking history response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Booking history error response:', errorData);
        throw new Error('Failed to fetch booking history');
      }

      const data = await response.json();
      console.log('Booking history data:', data);
      return data;
    } catch (error) {
      console.error('Error fetching booking history:', error);
      throw error;
    }
  }

  async getBookingDetails(bookingId) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/payments/bookings/${bookingId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch booking details');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching booking details:', error);
      throw error;
    }
  }
}

export default new PaymentService(); 