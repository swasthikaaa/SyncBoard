'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FileText, Mail, Lock, User, ArrowRight, AlertCircle, Loader2, CheckCircle2, Zap, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                router.push('/auth/login?registered=true');
            } else {
                setError(data.error || 'Something went wrong');
            }
        } catch {
            setError('Connection error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', background: '#fff', fontFamily: 'Inter, sans-serif' }}>

            {/* Left Sidebar Content - Branding & Features */}
            <div style={{
                flex: 1,
                background: '#6366f1',
                padding: '60px',
                display: 'none',
                flexDirection: 'column',
                justifyContent: 'center',
                color: '#fff',
                position: 'relative',
                overflow: 'hidden',
                '@media (min-width: 1024px)': { display: 'flex' }
            } as any} className="hidden lg:flex">

                {/* Background Decorative Element */}
                <div style={{
                    position: 'absolute',
                    bottom: '-10%',
                    left: '-10%',
                    width: '500px',
                    height: '500px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.05)',
                    zIndex: 0
                }} />

                <div style={{ position: 'relative', zIndex: 1, maxWidth: '440px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '40px' }}>
                        <div style={{ background: '#fff', padding: 10, borderRadius: '12px', display: 'flex' }}>
                            <FileText size={28} color="#6366f1" />
                        </div>
                        <span style={{ fontSize: '28px', fontWeight: 900, letterSpacing: '-0.04em' }}>SyncBoard</span>
                    </div>

                    <h1 style={{ fontSize: '48px', fontWeight: 900, lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-0.05em' }}>
                        Start creating <br />
                        <span style={{ opacity: 0.7 }}>without boundaries.</span>
                    </h1>

                    <p style={{ fontSize: '18px', lineHeight: 1.6, marginBottom: '48px', opacity: 0.9, fontWeight: 500 }}>
                        Join thousands of teams who trust SyncBoard for their real-time collaboration needs.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        <div style={{ display: 'flex', gap: 16 }}>
                            <div style={{ background: 'rgba(255,255,255,0.15)', padding: 10, borderRadius: '12px', height: 'fit-content' }}>
                                <Zap size={20} />
                            </div>
                            <div>
                                <h4 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '4px' }}>Fast Set Up</h4>
                                <p style={{ opacity: 0.7, fontSize: '14px' }}>Get your workspace running in seconds with zero configuration.</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 16 }}>
                            <div style={{ background: 'rgba(255,255,255,0.15)', padding: 10, borderRadius: '12px', height: 'fit-content' }}>
                                <CheckCircle2 size={20} />
                            </div>
                            <div>
                                <h4 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '4px' }}>Enterprise Security</h4>
                                <p style={{ opacity: 0.7, fontSize: '14px' }}>Your data is encrypted end-to-end and stored securely in the cloud.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Content - Register Form */}
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px',
                background: '#f8fafc'
            }}>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{ width: '100%', maxWidth: '400px' }}
                >
                    <div style={{ marginBottom: '40px' }}>
                        <div className="lg:hidden" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '32px' }}>
                            <div style={{ background: '#6366f1', padding: 8, borderRadius: '10px', display: 'flex' }}>
                                <FileText size={20} color="#fff" />
                            </div>
                            <span style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>SyncBoard</span>
                        </div>
                        <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#0f172a', marginBottom: '8px', letterSpacing: '-0.03em' }}>Create Account</h2>
                        <p style={{ color: '#64748b', fontWeight: 500 }}>Join SyncBoard today for free.</p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {error && (
                            <div style={{
                                background: '#fef2f2',
                                border: '1px solid #fee2e2',
                                color: '#ef4444',
                                padding: '14px 16px',
                                borderRadius: '16px',
                                fontSize: '13px',
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}>
                                <AlertCircle size={18} />
                                {error}
                            </div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '12px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Name</label>
                            <div style={{ position: 'relative' }}>
                                <User style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#cbd5e1' }} size={18} />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                    required
                                    style={{
                                        width: '100%',
                                        background: '#fff',
                                        border: '1.5px solid #e2e8f0',
                                        borderRadius: '16px',
                                        padding: '16px 16px 16px 48px',
                                        fontSize: '15px',
                                        outline: 'none',
                                        transition: 'all 0.2s',
                                        color: '#0f172a',
                                        fontWeight: 500
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '12px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</label>
                            <div style={{ position: 'relative' }}>
                                <Mail style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#cbd5e1' }} size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@company.com"
                                    required
                                    style={{
                                        width: '100%',
                                        background: '#fff',
                                        border: '1.5px solid #e2e8f0',
                                        borderRadius: '16px',
                                        padding: '16px 16px 16px 48px',
                                        fontSize: '15px',
                                        outline: 'none',
                                        transition: 'all 0.2s',
                                        color: '#0f172a',
                                        fontWeight: 500
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '12px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#cbd5e1' }} size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    style={{
                                        width: '100%',
                                        background: '#fff',
                                        border: '1.5px solid #e2e8f0',
                                        borderRadius: '16px',
                                        padding: '16px 16px 16px 48px',
                                        fontSize: '15px',
                                        outline: 'none',
                                        transition: 'all 0.2s',
                                        color: '#0f172a'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
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
                                borderRadius: '16px',
                                padding: '18px',
                                fontWeight: 900,
                                fontSize: '15px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '12px',
                                cursor: loading ? 'default' : 'pointer',
                                boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)',
                                transition: 'all 0.2s',
                                marginTop: '12px'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#4f46e5'}
                            onMouseLeave={(e) => e.currentTarget.style.background = '#6366f1'}
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <>Create Account <ArrowRight size={20} /></>}
                        </button>
                    </form>

                    <p style={{ marginTop: '40px', textAlign: 'center', fontSize: '14px', color: '#64748b', fontWeight: 500 }}>
                        Already have an account?{' '}
                        <Link href="/auth/login" style={{ fontWeight: 800, color: '#6366f1', textDecoration: 'none' }}>
                            Sign in here
                        </Link>
                    </p>

                    <footer style={{ marginTop: '60px', textAlign: 'center' }}>
                        <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            &copy; 2024 SyncBoard Inc. All rights reserved.
                        </p>
                    </footer>
                </motion.div>
            </div>
        </div>
    );
}
