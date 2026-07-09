# Breanzy

Personal site, portfolio, and blog for Brean Julius Carbonilla — a full-stack developer based in Melbourne, Australia.

🔗 Live: [https://breanzy.com](https://breanzy.com)

## Tech Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS** for styling
- **Redux Toolkit** with `redux-persist` for client state
- **MongoDB + Mongoose** for data storage
- **Firebase Storage** for media uploads
- **Resend** for transactional email and newsletter delivery
- **TipTap** for rich text editing

## Features

- Blog posts with rich text editing, search, and comments (with likes)
- Projects portfolio section
- Resume and about pages
- Admin dashboard for managing posts, projects, comments, users, and newsletter subscribers
- Newsletter subscription and delivery
- Contact form
- Authentication via email/password or Google, with JWT-based sessions (`access_token` cookie) and bcrypt password hashing

## Setup & Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Breanzy/Breanzy-Blog.git
   cd Breanzy-Blog
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```bash
   MONGO=
   JWT_SECRET=
   SITE_URL=
   RESEND_API_KEY=
   RESEND_FROM_EMAIL=
   NEXT_PUBLIC_FIREBASE_API_KEY=
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
   NEXT_PUBLIC_FIREBASE_APP_ID=
   ```

4. Run the development server
   ```bash
   npm run dev
   ```

## Other Commands

- Production build: `npm run build`
- Start production server: `npm run start`
- Lint: `npm run lint`
- Type-check: `npx tsc --noEmit`
