import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            // For security, don't reveal if user exists. Just say "if email exists, OTP sent"
            // But usually for UX, we tell them if not found. Let's be friendly for now.
            return NextResponse.json({ error: 'No account found with this email' }, { status: 404 });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        user.resetOTP = otp;
        user.resetOTPExpires = otpExpiry;
        await user.save();

        // Configure Nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"SyncBoard Support" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Password Reset OTP - SyncBoard',
            html: `
                <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #e2e8f0; borderRadius: 24px;">
                    <h2 style="color: #6366f1; font-weight: 900; margin-bottom: 24px;">Password Reset Request</h2>
                    <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 32px;">
                        We received a request to reset your password. Use the following 6-digit code to proceed. 
                        This code is valid for <strong>10 minutes</strong>.
                    </p>
                    <div style="background: #f8fafc; padding: 24px; border-radius: 16px; text-align: center; margin-bottom: 32px;">
                        <span style="font-size: 32px; font-weight: 900; letter-spacing: 0.2em; color: #0f172a;">${otp}</span>
                    </div>
                    <p style="color: #94a3b8; font-size: 14px;">
                        If you didn't request this, you can safely ignore this email.
                    </p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ message: 'OTP sent successfully' });
    } catch (error: any) {
        console.error('Forgot password error details:', error);
        return NextResponse.json({ error: `Failed to send OTP: ${error.message}` }, { status: 500 });
    }
}
