# Paytm-Like Payment Platform

A comprehensive digital payment platform built with Node.js, Express, React, and PostgreSQL. This platform enables users to create wallets, transfer money, and make merchant payments seamlessly.

## Features

### 🔐 User Management
- User registration and login with JWT authentication
- Secure password hashing with bcryptjs
- Profile management
- Email verification

### 💰 Wallet Management
- Create and manage digital wallets
- Add money via multiple payment methods (Card, Bank, UPI)
- Real-time balance tracking
- Withdraw money to bank accounts

### 💸 Money Transfer
- Send money to other users via email
- Transaction history
- Transaction tracking and status updates
- Detailed transaction records

### 🏪 Merchant Services
- Merchant registration and approval
- Merchant payment processing
- Commission tracking
- Merchant transaction history and analytics

### 🔒 Security Features
- JWT token-based authentication
- Password encryption
- Rate limiting on API endpoints
- Input validation with Joi
- SQL injection prevention with parameterized queries

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: Joi
- **Rate Limiting**: express-rate-limit
- **Environment Variables**: dotenv

### Frontend
- **Framework**: React
- **State Management**: Redux/Context API (to be implemented)
- **Styling**: Tailwind CSS / Material-UI
- **HTTP Client**: Axios
- **Routing**: React Router

### Database
- **PostgreSQL** 12+
- Indexed tables for optimal performance
- Foreign key relationships

## Project Structure

```
paytm-platform/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── wallet.js
│   │   ├── transaction.js
│   │   └── merchant.js
│   ├── database/
│   │   └── schema.sql
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## Installation

### Prerequisites
- Node.js (v14+)
- PostgreSQL (v12+)
- npm or yarn

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/sk7459490-del/paytm-platform.git
cd paytm-platform/backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Create PostgreSQL database**
```bash
createdb paytm_db
```

5. **Run database schema**
```bash
psql -U postgres -d paytm_db -f database/schema.sql
```

6. **Start the server**
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd ../frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create .env file**
```bash
REACT_APP_API_URL=http://localhost:5000
```

4. **Start the development server**
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile

### Wallet
- `GET /api/wallet/balance` - Get wallet balance
- `POST /api/wallet/add-money` - Add money to wallet
- `POST /api/wallet/withdraw` - Withdraw money

### Transactions
- `POST /api/transactions/send` - Send money to another user
- `GET /api/transactions/history` - Get transaction history
- `GET /api/transactions/:id` - Get transaction details

### Merchant
- `POST /api/merchant/register` - Register as merchant
- `GET /api/merchant/profile` - Get merchant profile
- `POST /api/merchant/payment` - Process payment
- `GET /api/merchant/transactions` - Get merchant transactions

## API Request/Response Examples

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "+91-9876543210"
}

Response:
{
  "message": "User registered successfully"
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "+91-9876543210"
  }
}
```

### Add Money
```bash
POST /api/wallet/add-money
Authorization: Bearer {token}
Content-Type: application/json

{
  "amount": 1000,
  "paymentMethod": "card"
}

Response:
{
  "message": "Money added successfully",
  "amount": 1000
}
```

### Send Money
```bash
POST /api/transactions/send
Authorization: Bearer {token}
Content-Type: application/json

{
  "recipientEmail": "recipient@example.com",
  "amount": 500,
  "description": "Payment for dinner"
}

Response:
{
  "message": "Money sent successfully",
  "transaction": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "amount": 500,
    "recipient": "recipient@example.com"
  }
}
```

## Database Schema

### Users Table
```sql
- id (UUID, Primary Key)
- email (VARCHAR, Unique)
- password (VARCHAR, Hashed)
- name (VARCHAR)
- phone (VARCHAR)
- is_verified (BOOLEAN)
- created_at (TIMESTAMP)
```

### Wallets Table
```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key)
- balance (DECIMAL)
- created_at (TIMESTAMP)
```

### Transactions Table
```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key)
- recipient_id (UUID, Foreign Key)
- merchant_id (UUID, Foreign Key)
- type (VARCHAR: transfer, merchant_payment, add_money, withdraw)
- amount (DECIMAL)
- status (VARCHAR: pending, completed, failed)
- created_at (TIMESTAMP)
```

### Merchants Table
```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key)
- business_name (VARCHAR)
- category (VARCHAR)
- status (VARCHAR)
- commission_rate (DECIMAL)
- created_at (TIMESTAMP)
```

## Environment Variables

### Backend (.env)
```
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=paytm_db
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Payment Gateway
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

## Security Best Practices

1. **Password Security**
   - All passwords are hashed using bcryptjs with salt rounds of 10
   - Never store plain text passwords

2. **Authentication**
   - JWT tokens are used for secure authentication
   - Tokens expire after 7 days
   - Always validate tokens on protected routes

3. **Data Validation**
   - All inputs are validated using Joi schemas
   - SQL injection is prevented with parameterized queries
   - Rate limiting prevents brute force attacks

4. **Database Security**
   - Foreign key constraints maintain data integrity
   - Indexed columns for optimal query performance
   - Parameterized queries prevent SQL injection

## Future Enhancements

- [ ] Email verification
- [ ] Two-factor authentication (2FA)
- [ ] Payment gateway integration (Razorpay, Stripe)
- [ ] Bill payment feature
- [ ] Cryptocurrency support
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] QR code payments
- [ ] Recurring payments
- [ ] Referral program
- [ ] Dispute resolution system
- [ ] KYC verification

## Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
psql -U postgres -l

# If connection fails, update DB_HOST in .env
# For macOS with Docker: host.docker.internal
# For Linux: localhost or 127.0.0.1
```

### JWT Token Issues
```bash
# Token expired error
# Generate a new token by logging in again

# Invalid token error
# Ensure JWT_SECRET in .env matches backend
```

### CORS Issues
```bash
# Update FRONTEND_URL in backend .env
# Update REACT_APP_API_URL in frontend .env
```

## Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@paytm-platform.com or open an issue on GitHub.

## Roadmap

### Phase 1 (Current)
- ✅ User authentication
- ✅ Wallet management
- ✅ P2P transfers
- ✅ Merchant payments

### Phase 2
- [ ] Mobile app
- [ ] Bill payments
- [ ] Payment gateway integration
- [ ] Email notifications

### Phase 3
- [ ] 2FA and enhanced security
- [ ] Advanced analytics
- [ ] KYC verification
- [ ] Cryptocurrency support

## Contact

**Developer**: sk7459490-del
**Email**: sk7459490@gmail.com
**GitHub**: https://github.com/sk7459490-del

---

**Last Updated**: September 2026
**Version**: 1.0.0
