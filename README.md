# Amit's Advisory - Premium Stock Market Signals

A full-stack, modern fintech web application designed to securely manage subscriptions, display real-time trading calls, and process seamless zero-commission payments. 

## Features

- **Freemium Dashboard:** Active trading calls dynamically blur for unpaid users ("Premium Calls Locked") with a sleek glassmorphism overlay.
- **Serverless Payment Backend:** Fully integrated with the S2S PhonePe API using highly secure Vercel Serverless Functions (`/api/*`) for cryptographic `SHA-256` hashing and processing to bypass middleman commissions.
- **Real-Time Database Sync:** Data pulled directly from Firebase Firestore allows users to receive new stock entries milliseconds after they are generated without ever refreshing the page.
- **Live Performance Matrix:** An algorithmic calculation tab that tracks total calls, hit rates, and raw mathematical accuracy percentages based on historical signals.
- **Dynamic Admin Panel:** Fully secured, role-checked route (`role === 'admin'`) allowing instant creation, modification, and pricing changes to Subscription Tiers and Trade Calls that instantly push to client screens.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS (Glassmorphism design schema)
- **Backend:** Vercel Serverless (Node.js) API layer for Cryptographic Hashing
- **Database / Auth:** Google Firebase (Firestore, Authentication)
- **Payment Gateway:** PhonePe 
- **Animations:** React Three Fiber, Framer Motion

## Installation & Setup

1. **Clone Repo:**
   ```bash
   git clone https://github.com/Amit-KumarSharma/Stock-Market.git
   ```
2. **Install Dependencies:**
   ```bash
   npm install
   ```
3. **Environment Tokens:**
   Drop a `.env` file into the root directory mapping to your Firebase Instance and PhonePe Sandbox API Keys:
   ```env
   VITE_FIREBASE_API_KEY="..."
   VITE_FIREBASE_AUTH_DOMAIN="..."
   # ...etc
   PHONEPE_MERCHANT_ID="..."
   PHONEPE_SALT_KEY="..."
   ```
4. **Boot Development Server:**
   ```bash
   npm run dev
   ```

---
*Built intricately with modern reactive patterns and robust backend security.*
