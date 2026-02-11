'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

function VerifyOTPContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            prevInput?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setError('Please enter all 6 digits');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp: otpString }),
            });

            const data = await res.json();

            if (res.ok) {
                router.push(`/auth/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otpString)}`);
            } else {
                setError(data.error || 'Verification failed');
            }
        } catch {
            setError('Connection error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#d1e0f0',
            fontFamily: '"Inter", sans-serif',
            padding: '20px'
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                    width: '100%',
                    maxWidth: '500px',
                    background: '#fff',
                    padding: '60px 40px',
                    boxShadow: '0 30px 60px -12px rgba(30, 27, 75, 0.25)',
                    borderRadius: '24px',
                    textAlign: 'center'
                }}
            >
                <div style={{
                    background: '#ebf4ff',
                    width: 70,
                    height: 70,
                    borderRadius: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 32px',
                    color: '#6366f1'
                }}>
                    <ShieldCheck size={36} strokeWidth={2.5} />
                </div>

                <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#1e1b4b', marginBottom: '12px', letterSpacing: '-0.02em' }}>Verification Code</h1>
                <p style={{ color: '#64748b', marginBottom: '40px', fontWeight: 500, lineHeight: 1.6 }}>
                    We've sent a 6-digit verification code to <br />
                    <strong style={{ color: '#0f172a' }}>{email}</strong>
                </p>

                <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {error && (
                        <div style={{ background: '#fef2f2', color: '#ef4444', padding: '14px', borderRadius: '16px', fontSize: '13px', textAlign: 'center', fontWeight: 'bold', border: '1px solid #fee2e2', display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                        {otp.map((digit, idx) => (
                            <input
                                key={idx}
                                id={`otp-${idx}`}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleOtpChange(idx, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(idx, e)}
                                style={{
                                    width: '100%',
                                    aspectRatio: '1/1',
                                    textAlign: 'center',
                                    fontSize: '24px',
                                    fontWeight: 900,
                                    borderRadius: '14px',
                                    border: '2px solid #eef2f6',
                                    background: '#f8fafc',
                                    outline: 'none',
                                    transition: 'all 0.2s',
                                    color: '#6366f1'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                                onBlur={(e) => e.target.style.borderColor = '#eef2f6'}
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            background: '#6366f1',
                            color: '#fff',
                            border: 'none',
                            padding: '20px',
                            borderRadius: '16px',
                            fontWeight: 900,
                            fontSize: '16px',
                            cursor: loading ? 'default' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 12,
                            boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)',
                            transition: 'all 0.2s',
                            marginTop: 10
                        }}
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <>Verify Account <ArrowRight size={20} /></>}
                    </button>

                    <p style={{ fontSize: 14, color: '#94a3b8', fontWeight: 600 }}>
                        Haven't received it? <span style={{ color: '#6366f1', cursor: 'pointer' }}>Resend Code</span>
                    </p>
                </form>
            </motion.div>
        </div>
    );
}

export default function VerifyOTPPage() {
    return (
        <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader2 className="animate-spin" color="#6366f1" size={40} /></div>}>
            <VerifyOTPContent />
        </Suspense>
    );
}
