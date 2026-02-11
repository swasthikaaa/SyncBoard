'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Facebook, Github, Chrome } from 'lucide-react';
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
                setError('Invalid credentials');
            } else {
                router.push('/dashboard');
                router.refresh();
            }
        } catch {
            setError('Connection error');
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
            background: '#d1e0f0', // Soft blue-gray background
            fontFamily: '"Inter", sans-serif',
            padding: '20px'
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mobile-stack mobile-full"
                style={{
                    display: 'flex',
                    width: '100%',
                    maxWidth: '960px',
                    minHeight: '600px',
                    background: '#fff',
                    boxShadow: '0 30px 60px -12px rgba(30, 27, 75, 0.25)',
                    overflow: 'hidden',
                    flexDirection: 'row',
                    borderRadius: '4px'
                }}
            >
                {/* Left Side - Login Form (White Section) */}
                <div
                    className="mobile-padding mobile-full"
                    style={{
                        flex: 1,
                        padding: '80px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <h1 style={{ fontSize: 'var(--fs-title)', fontWeight: 900, color: '#1e1b4b', marginBottom: '40px', letterSpacing: '-0.02em' }}>Sign In</h1>

                    <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {error && <p style={{ color: '#ef4444', fontSize: '13px', textAlign: 'center', fontWeight: 'bold' }}>{error}</p>}

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            required
                            style={{
                                width: '100%',
                                background: '#f8fafc',
                                border: '1.5px solid #eef2f6',
                                padding: '20px 24px',
                                borderRadius: '8px',
                                fontSize: '16px',
                                outline: 'none',
                                color: '#1e1b4b',
                                fontWeight: 500
                            }}
                        />

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                            style={{
                                width: '100%',
                                background: '#f8fafc',
                                border: '1.5px solid #eef2f6',
                                padding: '20px 24px',
                                borderRadius: '8px',
                                fontSize: '16px',
                                outline: 'none',
                                color: '#1e1b4b',
                                fontWeight: 500
                            }}
                        />

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -10 }}>
                            <Link href="/auth/forgot-password" style={{ fontSize: '13px', fontWeight: 700, color: '#6366f1', textDecoration: 'none' }}>
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                background: '#6366f1', // Indigo Theme
                                color: '#fff',
                                border: 'none',
                                padding: '20px',
                                borderRadius: '8px',
                                fontWeight: 800,
                                fontSize: '17px',
                                cursor: loading ? 'default' : 'pointer',
                                marginTop: '10px',
                                boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#4f46e5'}
                            onMouseLeave={(e) => e.currentTarget.style.background = '#6366f1'}
                        >
                            {loading ? <Loader2 className="animate-spin" style={{ margin: '0 auto' }} /> : 'Sign In'}
                        </button>
                    </form>

                    <div style={{ marginTop: '40px', textAlign: 'center' }}>
                        <p style={{ fontSize: '12px', fontWeight: 800, color: '#94a3b8', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>or sign in with</p>
                        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#fff', border: '1.5px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1e1b4b', cursor: 'pointer' }}>
                                <Facebook size={20} fill="currentColor" />
                            </div>
                            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#fff', border: '1.5px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1e1b4b', cursor: 'pointer' }}>
                                <Chrome size={20} />
                            </div>
                            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#fff', border: '1.5px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1e1b4b', cursor: 'pointer' }}>
                                <Github size={20} fill="currentColor" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Branding (Indigo Section) */}
                <div
                    className="mobile-hide"
                    style={{
                        flex: 1,
                        background: 'linear-gradient(135deg, #1e1b4b 0%, #6366f1 100%)', // Indigo Black-Blue Gradient
                        padding: '60px 50px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        textAlign: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    {/* Decorative Overlay */}
                    <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '300px', height: '300px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
                    <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '200px', height: '200px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />

                    <h2 style={{ fontSize: '36px', fontWeight: 900, marginBottom: '25px', letterSpacing: '-0.01em', position: 'relative' }}>Welcome back!</h2>
                    <p style={{ fontSize: '17px', lineHeight: '1.7', marginBottom: '50px', opacity: 0.9, maxWidth: '380px', position: 'relative', fontWeight: 500 }}>
                        Welcome back! We are so happy to have you here. It's great to see you again. We hope you had a safe and enjoyable time away.
                    </p>

                    <Link href="/auth/register" style={{ textDecoration: 'none', position: 'relative' }}>
                        <div style={{
                            border: '2px solid rgba(255,255,255,0.5)',
                            padding: '16px 60px',
                            borderRadius: '50px',
                            color: '#fff',
                            fontWeight: '800',
                            fontSize: '15px',
                            transition: 'all 0.3s',
                            background: 'rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(10px)',
                            display: 'inline-block'
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                        >
                            No account yet? Sign Up.
                        </div>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
