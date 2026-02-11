'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FileText, Mail, Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                setError('Invalid email or password.');
            } else {
                router.push('/dashboard');
                router.refresh();
            }
        } catch {
            setError('Connection error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ width: '100%', maxWidth: 440 }}
            >
                <div style={{ background: '#fff', borderRadius: 40, boxShadow: '0 25px 50px -12px rgba(99, 102, 241, 0.1)', padding: 48, border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 40 }}>
                        <div style={{ background: '#6366f1', padding: 14, borderRadius: 20, boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)', marginBottom: 24 }}>
                            <FileText size={36} color="white" />
                        </div>
                        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.05em' }}>SyncBoard</h1>
                        <p style={{ color: '#64748b', marginTop: 8, fontWeight: 600 }}>Sign in to continue</p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        {error && (
                            <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#ef4444', padding: '12px 16px', borderRadius: 16, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10 }}>
                                <AlertCircle size={18} />
                                {error}
                            </div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <label style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', tracking: '0.05em', marginLeft: 4 }}>Email</label>
                            <div style={{ position: 'relative' }}>
                                <Mail style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#cbd5e1' }} size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@email.com"
                                    required
                                    style={{ width: '100%', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 16, padding: '14px 16px 14px 44px', fontSize: 14, outline: 'none', transition: 'all 0.2s', color: '#0f172a' }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <label style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', tracking: '0.05em', marginLeft: 4 }}>Password</label>
                                <Link href="#" style={{ fontSize: 11, fontWeight: 800, color: '#6366f1', textDecoration: 'none' }}>Forgot?</Link>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Lock style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#cbd5e1' }} size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    style={{ width: '100%', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 16, padding: '14px 16px 14px 44px', fontSize: 14, outline: 'none', transition: 'all 0.2s', color: '#0f172a' }}
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
                                borderRadius: 16,
                                padding: '16px',
                                fontWeight: 800,
                                fontSize: 15,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 10,
                                cursor: loading ? 'default' : 'pointer',
                                boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)',
                                transition: 'all 0.2s',
                            }}
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <>Sign In <ArrowRight size={20} /></>}
                        </button>
                    </form>

                    <div style={{ marginTop: 40, paddingTop: 32, borderTop: '1px solid #f8fafc', textAlign: 'center' }}>
                        <p style={{ fontSize: 14, color: '#64748b' }}>
                            First time here?{' '}
                            <Link href="/auth/register" style={{ fontWeight: 800, color: '#6366f1', textDecoration: 'none' }}>
                                Join SyncBoard
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
