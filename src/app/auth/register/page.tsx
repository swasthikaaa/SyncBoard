'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Facebook, Github, Chrome } from 'lucide-react';
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
            background: '#d1e0f0',
            fontFamily: '"Inter", sans-serif',
            padding: '20px'
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
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
                {/* Left Side - Register Form */}
                <div style={{
                    flex: 1,
                    padding: '60px 80px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <h1 style={{ fontSize: '48px', fontWeight: 900, color: '#1e1b4b', marginBottom: '30px', letterSpacing: '-0.02em' }}>Sign Up</h1>

                    <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {error && <p style={{ color: '#ef4444', fontSize: '13px', textAlign: 'center', fontWeight: 'bold' }}>{error}</p>}

                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Full Name"
                            required
                            style={{
                                width: '100%',
                                background: '#f8fafc',
                                border: '1.5px solid #eef2f6',
                                padding: '16px 20px',
                                borderRadius: '8px',
                                fontSize: '15px',
                                outline: 'none',
                                color: '#1e1b4b',
                                fontWeight: 500
                            }}
                        />

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email address"
                            required
                            style={{
                                width: '100%',
                                background: '#f8fafc',
                                border: '1.5px solid #eef2f6',
                                padding: '16px 20px',
                                borderRadius: '8px',
                                fontSize: '15px',
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
                                padding: '16px 20px',
                                borderRadius: '8px',
                                fontSize: '15px',
                                outline: 'none',
                                color: '#1e1b4b',
                                fontWeight: 500
                            }}
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                background: '#6366f1',
                                color: '#fff',
                                border: 'none',
                                padding: '18px',
                                borderRadius: '8px',
                                fontWeight: 800,
                                fontSize: '16px',
                                cursor: loading ? 'default' : 'pointer',
                                marginTop: '10px',
                                boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#4f46e5'}
                            onMouseLeave={(e) => e.currentTarget.style.background = '#6366f1'}
                        >
                            {loading ? <Loader2 className="animate-spin" style={{ margin: '0 auto' }} /> : 'Sign Up'}
                        </button>
                    </form>

                    <div style={{ marginTop: '30px', textAlign: 'center' }}>
                        <p style={{ fontSize: '12px', fontWeight: 800, color: '#94a3b8', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>or sign up with</p>
                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fff', border: '1.5px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1e1b4b', cursor: 'pointer' }}>
                                <Facebook size={18} fill="currentColor" />
                            </div>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fff', border: '1.5px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1e1b4b', cursor: 'pointer' }}>
                                <Chrome size={18} />
                            </div>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fff', border: '1.5px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1e1b4b', cursor: 'pointer' }}>
                                <Github size={18} fill="currentColor" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Branding/Switch */}
                <div style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #1e1b4b 0%, #6366f1 100%)',
                    padding: '60px 50px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '300px', height: '300px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />

                    <h2 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '20px', letterSpacing: '-0.01em', position: 'relative' }}>Join us!</h2>
                    <p style={{ fontSize: '16px', lineHeight: '1.7', marginBottom: '40px', opacity: 0.9, position: 'relative', fontWeight: 500 }}>
                        Join our community today and start collaborating in real-time. Experience the most powerful workspace for your team.
                    </p>

                    <Link href="/auth/login" style={{ textDecoration: 'none', position: 'relative' }}>
                        <div style={{
                            border: '2px solid rgba(255,255,255,0.4)',
                            padding: '14px 50px',
                            borderRadius: '50px',
                            color: '#fff',
                            fontWeight: '800',
                            fontSize: '14px',
                            transition: 'all 0.3s',
                            background: 'rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(10px)',
                            display: 'inline-block'
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                        >
                            Already have an account? Sign In.
                        </div>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
