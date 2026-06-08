import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): object {
    return {
      message: 'Welcome to CeyXcape Tourism Platform API v2.0',
      status: 'running',
      documentation: '/api',
      endpoints: {
        auth: '/api/auth',
        tours: '/api/tours',
        bookings: '/api/bookings',
        reviews: '/api/reviews',
        wishlist: '/api/wishlist',
        payments: '/api/payments',
      },
    };
  }
}
