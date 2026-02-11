'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';
    const otp = searchParams.get('otp') || '';

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, newPassword: password }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => {
                    router.push('/auth/login');
                }, 3000);
            } else {
                setError(data.error || 'Reset failed');
            }
        } catch {
            setError('Connection error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#d1e0f0', fontFamily: '"Inter", sans-serif', padding: '20px' }}>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ width: '100%', maxWidth: '500px', background: '#fff', padding: '60px 40px', boxShadow: '0 30px 60px -12px rgba(30, 27, 75, 0.25)', borderRadius: '24px', textAlign: 'center' }}>
                    <div style={{ color: '#10b981', background: '#f0fdf4', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
                        <CheckCircle2 size={48} />
                    </div>
                    <h2 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '16px' }}>Password Saved!</h2>
                    <p style={{ color: '#64748b', fontSize: '18px', fontWeight: 500, lineHeight: 1.6 }}>Your password has been successfully updated. Redirecting you to login...</p>
                </motion.div>
            </div>
        );
    }

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
                <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#1e1b4b', marginBottom: '12px', letterSpacing: '-0.02em' }}>Set New Password</h1>
                <p style={{ color: '#64748b', marginBottom: '40px', fontWeight: 500, lineHeight: 1.6 }}>
                    Please choose a strong password that you haven't used before.
                </p>

                <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {error && (
                        <div style={{ background: '#fef2f2', color: '#ef4444', padding: '14px', borderRadius: '16px', fontSize: '13px', textAlign: 'center', fontWeight: 'bold', border: '1px solid #fee2e2', display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
                        <label style={{ fontSize: '12px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginLeft: 4 }}>New Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#cbd5e1' }} size={18} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="At least 6 characters"
                                required
                                style={{
                                    width: '100%',
                                    background: '#f8fafc',
                                    border: '1.5px solid #eef2f6',
                                    padding: '18px 50px 18px 54px',
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
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex' }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
                        <label style={{ fontSize: '12px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginLeft: 4 }}>Confirm Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#cbd5e1' }} size={18} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Repeat your password"
                                required
                                style={{
                                    width: '100%',
                                    background: '#f8fafc',
                                    border: '1.5px solid #eef2f6',
                                    padding: '18px 50px 18px 54px',
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
                            transition: 'all 0.2s',
                            marginTop: 10
                        }}
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Set New Password'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader2 className="animate-spin" color="#6366f1" size={40} /></div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}
