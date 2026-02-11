# SyncBoard Deployment Guide (Vercel)

SyncBoard is built with Next.js, making it highly optimized for deployment on **Vercel**. Both the frontend (React) and backend (API Routes) will be hosted together in a single serverless environment.

## 🚀 Deployment Steps

1. **Push Changes to GitHub**
   Ensure all local changes are pushed to your repository (I have already pushed the latest responsiveness fixes).

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com) and sign in.
   - Click **"New Project"**.
   - Import your `SyncBoard` repository.

3. **Configure Environment Variables**
   During the setup, go to the **Environment Variables** section and add the following keys from your `.env.local`:

   | Key | Value Note |
   |-----|------------|
   | `MONGODB_URI` | Your MongoDB Atlas connection string |
   | `NEXTAUTH_SECRET` | A long random string for auth security |
   | `NEXTAUTH_URL` | Set to your Vercel deployment URL (e.g., `https://your-app.vercel.app`) |
   | `EMAIL_SERVICE` | `gmail` (or your service) |
   | `EMAIL_USER` | `swasthikalingaraj@gmail.com` |
   | `EMAIL_PASS` | `rmvy hbic pdey tlfy` |
   | `NEXT_PUBLIC_PUSHER_KEY` | From Pusher Dashboard |
   | `PUSHER_APP_ID` | From Pusher Dashboard |
   | `PUSHER_SECRET` | From Pusher Dashboard |
   | `NEXT_PUBLIC_PUSHER_CLUSTER` | e.g., `ap2` |

4. **Deploy**
   Click **Deploy**. Vercel will automatically build the project and provide you with a live URL.

## 🛠️ Optimization Notes

- **Serverless Database**: The current `src/lib/mongodb.ts` is already optimized with connection caching to handle Vercel's serverless scaling without exhausting database connections.
- **Pusher Real-time**: Real-time collaboration via Pusher will work out of the box as long as the environment variables are set.
- **API Routes**: All files in `src/app/api/...` will automatically be deployed as Vercel Serverless Functions.

## 🚨 Troubleshooting

- **Auth Issues**: Ensure `NEXTAUTH_URL` matches your production domain exactly.
- **DB Connection**: Ensure your MongoDB Atlas IP Whitelist allows all connections (`0.0.0.0/0`) or uses Vercel's integration.
