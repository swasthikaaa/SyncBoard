'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, ArrowRight, AlertCircle, Loader2, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                // Pass email to OTP page via search params
                router.push(`/auth/verify-otp?email=${encodeURIComponent(email)}`);
            } else {
                setError(data.error || 'Failed to send OTP');
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
                className="mobile-padding mobile-full"
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
                <Link href="/auth/login" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    color: '#64748b',
                    textDecoration: 'none',
                    fontSize: 14,
                    fontWeight: 800,
                    marginBottom: 40,
                    width: 'fit-content'
                }}>
                    <ChevronLeft size={18} /> Back to Sign In
                </Link>

                <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#1e1b4b', marginBottom: '12px', letterSpacing: '-0.02em' }}>Forgot Password?</h1>
                <p style={{ color: '#64748b', marginBottom: '40px', fontWeight: 500, lineHeight: 1.6 }}>
                    Enter your email address and we'll send you a 6-digit code to reset your password.
                </p>

                <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {error && (
                        <div style={{ background: '#fef2f2', color: '#ef4444', padding: '14px', borderRadius: '16px', fontSize: '13px', textAlign: 'center', fontWeight: 'bold', border: '1px solid #fee2e2', display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}>
                        <label style={{ fontSize: '12px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginLeft: 4 }}>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={20} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your registered email"
                                required
                                style={{
                                    width: '100%',
                                    background: '#f8fafc',
                                    border: '1.5px solid #eef2f6',
                                    padding: '18px 20px 18px 54px',
                                    borderRadius: '16px',
                                    fontSize: '15px',
                                    outline: 'none',
                                    color: '#1e1b4b',
                                    fontWeight: 500,
                                    transition: 'all 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                                onBlur={(e) => e.target.style.borderColor = '#eef2f6'}
                            />
                        </div>
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
                            transition: 'all 0.2s'
                        }}
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <>Send Verification Code <ArrowRight size={20} /></>}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
