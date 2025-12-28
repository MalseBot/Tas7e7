/** @format */

// app/auth/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/lib/api/services';
import { Lock, Mail, Coffee } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isPinLogin, setIsPinLogin] = useState(false);

	const loginMutation = useMutation({
		mutationFn: () =>
			isPinLogin ?
				authService.pinLogin(email, password)
			:	authService.login(email, password),
		onSuccess: (data) => {
			localStorage.setItem('token', data.data.token);
			localStorage.setItem('user', JSON.stringify(data.data.user));
			router.push('/dashboard');
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		loginMutation.mutate();
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-linear-to-br from-primary to-secondary p-4'>
			<div className='w-full max-w-md'>
				{/* Logo */}
				<div className='text-center mb-8'>
					<div className='inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4'>
						<Coffee className='w-8 h-8 text-white' />
					</div>
					<h1 className='text-3xl font-bold text-foreground'>Café POS</h1>
					<p className='text-muted-foreground mt-2'>
						Modern Restaurant Management
					</p>
				</div>

				{/* Login Card */}
				<div className='bg-card rounded-2xl shadow-lg border border-border p-8'>
					<h2 className='text-2xl font-bold text-foreground mb-6'>
						{isPinLogin ? 'Quick PIN Login' : 'Staff Login'}
					</h2>

					<form
						onSubmit={handleSubmit}
						className='space-y-6'>
						<div>
							<label className='block text-sm font-medium text-foreground mb-2'>
								Email Address
							</label>
							<div className='relative '>
								<Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground' />
								<Input
									type='email'
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className='w-80 pl-10 pr-4 py-3 bg-input-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
									placeholder='staff@cafe.com'
									required
								/>
							</div>
						</div>

						<div>
							<label className='block text-sm font-medium text-foreground mb-2'>
								{isPinLogin ? 'PIN Code' : 'Password'}
							</label>
							<div className='relative'>
								<Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground' />
								<Input
									type={'password'}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className='w-80 pl-10 pr-4 py-3 bg-input-background border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent'
									placeholder={
										isPinLogin ? 'Enter 4-digit PIN' : 'Enter password'
									}
									required
								/>
							</div>
						</div>

						<Button
							type='button'
							onClick={() => setIsPinLogin(!isPinLogin)}
							className='text-sm text-primary-foreground '>
							{isPinLogin ? 'Switch to Password Login' : 'Switch to PIN Login'}
						</Button>

						<Button
							type='submit'
							disabled={loginMutation.isPending}
							className='w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium'>
							{loginMutation.isPending ?
								<span className='flex items-center justify-center'>
									<svg
										className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
										fill='none'
										viewBox='0 0 24 24'>
										<circle
											className='opacity-25'
											cx='12'
											cy='12'
											r='10'
											stroke='currentColor'
											strokeWidth='4'
										/>
										<path
											className='opacity-75'
											fill='currentColor'
											d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
										/>
									</svg>
									Signing in...
								</span>
							:	'Sign In'}
						</Button>
					</form>
					{/* Registration Link */}
					<div className='text-center pt-4 border-t border-border'>
						<p className='text-sm text-muted-foreground'>
							Need an account?{' '}
							<Link
								href='/register'
								className='text-primary hover:underline'>
								Register here
							</Link>
						</p>
					</div>

					{loginMutation.error && (
						<div className='mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg'>
							<p className='text-destructive text-sm'>
								{loginMutation.error.message || 'Login failed'}
							</p>
						</div>
					)}

					<div className='mt-8 pt-6 border-t border-border'>
						<p className='text-sm text-muted-foreground text-center'>
							Demo credentials:{' '}
							<span className='font-medium'>admin@cafe.com / admin123</span>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
