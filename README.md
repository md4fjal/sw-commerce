# sw-commerce

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/md4fjal/sw-commerce.git
cd sw-commerce
```

---

## 🖥️ Client Setup (Frontend)

```bash
cd client
npm install
npm run dev
```

> The client runs on **[http://localhost:5173](http://localhost:5173)** by default.

---

## Server Setup (Backend)

```bash
cd server
npm install
```

### Create `.env` file in `server/`

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/db_name
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development

# Razorpay\RAZORPAY_KEY_ID=rzp_*****
RAZORPAY_SECRET=********

# Shiprocket
SHIPROCKET_EMAIL=your_shiprocket_email
SHIPROCKET_PASSWORD=your_shiprocket_password

```

### Start the backend server

```bash
npm run dev
```

> The server will run on **[http://localhost:5000](http://localhost:5000)**.

---

## Notes

- Ensure MongoDB is running locally.
- Razorpay and Shiprocket keys are required only for payment & shipping workflows.
