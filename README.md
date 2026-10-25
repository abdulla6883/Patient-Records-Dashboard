# 🏥 Medical Dashboard - Next.js Fullstack

A premium, modern medical dashboard built with **Next.js 16**, **Prisma**, and **Tailwind CSS**. This application provides a comprehensive patient management system with real-time clinical data visualization, editing capabilities, and a responsive design.

---

## ✨ Key Features

- **Patient Management**: Full CRUD operations for patient records.
- **Dynamic Vital Signs**: Real-time visualization of blood pressure, heart rate, and temperature using Chart.js.
- **Identity Editing**: Update patient details including avatars, contact info, and clinical metrics.
- **Lab Results**: Interactive list for viewing and managing diagnostic lab results.
- **Responsive UI**: Sleek, mobile-first design with smooth Framer Motion animations.
- **Secure Authentication**: Protected routes using NextAuth.js.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL (Neon) with Prisma ORM
- **Uploads**: Vercel Blob
- **Styling**: Tailwind CSS 4
- **State/Animations**: Framer Motion & React Hooks
- **Icons**: Lucide React
- **Charts**: Chart.js & React-Chartjs-2
- **Auth**: NextAuth.js v5

---

## 🚀 Getting Started

### 1. Prerequisites

- **Node.js**: v20.9 or higher
- **npm**: v9 or higher

### 2. Installation

Clone the repository and install the dependencies:

```bash
# Install dependencies
npm install
```

### 3. Environment and Database Setup

Copy `.env.example` to `.env` and configure a Supabase PostgreSQL project. Set `DATABASE_URL` to the Supabase transaction pooler connection string and `DIRECT_URL` to the direct connection string; use the same database password in both, URL-encoding special characters as needed. Set `AUTH_SECRET` to a generated secret. Google OAuth and SMTP credentials are optional and only needed for those features.

```bash
# Create/update the Supabase schema
npm run db:deploy

# Optional local/demo seed only. It deletes existing patient and related records.
npx prisma db seed
```

Set `DATABASE_URL`, `DIRECT_URL`, and a strong `AUTH_SECRET` in Vercel's Production environment, then redeploy. Existing local SQLite data in `prisma/dev.db` is not copied to Supabase automatically. Do not run the demo seed against a database containing data you need. For Vercel uploads, connect a **public** Vercel Blob store and add `BLOB_READ_WRITE_TOKEN`; the connected Blob store supplies Vercel's runtime credentials.

### 4. Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Local Demo Login

The optional demo seed creates these local-only credentials. Do not use them in production:

| Field    | Value                  |
| -------- | ---------------------- |
| **Email**    | `admin@coalition.com`  |
| **Password** | `password123`          |

---

## 📁 Project Structure

- `src/app`: Next.js App Router and API routes.
- `src/components`: Reusable UI components (PatientList, PatientDetail, BloodPressureChart, etc.).
- `src/services`: API service layer for frontend-backend communication.
- `prisma`: Database schema and seeding scripts.
- `public`: Static assets (images, avatars).

---

## 🧪 Testing Features

- **Adding a Patient**: Click the `+` button in the sidebar to add a new record.
- **Editing**: Select a patient and click "Update Information" in the right sidebar to enter edit mode.
- **Deleting**: Click the trash icon in the patient list or the delete button in the detail view.
- **Charts**: Hover over the blood pressure points to see detailed data for different months.
