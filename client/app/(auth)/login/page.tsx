/** @format */

// app/(auth)/login/page.tsx
'use client';

import { useState } from 'react';
import { Coffee, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export default function LoginPage() {
	const router = useRouter();
	const { login } = useAuth();
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [demoMode, setDemoMode] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			await login(formData.email, formData.password);
			toast({
				title: 'Welcome back!',
				description: 'You have successfully logged in.',
			});
		} catch (error: any) {
			toast({
				title: 'Login failed',
				description: error.message,
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
		}
	};

	const loadDemoAccount = (role: string) => {
		const accounts: Record<string, { email: string; password: string }> = {
			admin: { email: 'admin@cafe.com', password: 'admin123' },
			cashier: { email: 'cashier@cafe.com', password: 'cashier123' },
			cook: { email: 'cook@cafe.com', password: 'cook123' },
			manager: { email: 'manager@cafe.com', password: 'manager123' },
		};

		setFormData(accounts[role]);
		setDemoMode(true);
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-[#EBD5AB] to-[#8BAE66]/20 p-4'>
			<div className='w-full max-w-md'>
				{/* Logo */}
				<div className='text-center mb-8'>
					<div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-café rounded-2xl shadow-lg mb-4'>
						<Coffee className='h-8 w-8 text-white' />
					</div>
					<h1 className='text-3xl font-bold text-foreground'>Café POS</h1>
					<p className='text-muted-foreground mt-2'>
						Sign in to manage your restaurant
					</p>
				</div>

				{/* Login Card */}
				<div className='café-card p-8 shadow-xl'>
					<form
						onSubmit={handleSubmit}
						className='space-y-6'>
						<div className='space-y-2'>
							<Label htmlFor='email'>Email Address</Label>
							<Input
								id='email'
								name='email'
								type='email'
								placeholder='Enter your email'
								value={formData.email}
								onChange={handleChange}
								required
								className='bg-input-background'
							/>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='password'>Password</Label>
							<div className='relative'>
								<Input
									id='password'
									name='password'
									type={showPassword ? 'text' : 'password'}
									placeholder='Enter your password'
									value={formData.password}
									onChange={handleChange}
									required
									className='bg-input-background pr-10'
								/>
								<Button
									type='button'
									variant='ghost'
									size='icon'
									className='absolute right-0 top-0 h-full px-3'
									onClick={() => setShowPassword(!showPassword)}>
									{showPassword ? (
										<EyeOff className='h-4 w-4' />
									) : (
										<Eye className='h-4 w-4' />
									)}
								</Button>
							</div>
						</div>

						<Button
							type='submit'
							className='w-full bg-gradient-café hover:opacity-90'
							size='lg'
							disabled={isLoading}>
							{isLoading ? (
								<>
									<div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
									Signing in...
								</>
							) : (
								'Sign In'
							)}
						</Button>

						{demoMode && (
							<div className='text-center text-sm text-primary'>
								<p>Demo account loaded. Click Sign In to continue.</p>
							</div>
						)}
					</form>

					{/* Demo Accounts */}
					<div className='mt-8 pt-6 border-t border-border'>
						<p className='text-center text-sm text-muted-foreground mb-4'>
							Try a demo account:
						</p>
						<div className='grid grid-cols-2 gap-2'>
							<Button
								type='button'
								variant='outline'
								size='sm'
								onClick={() => loadDemoAccount('admin')}
								className='text-xs'>
								👑 Admin
							</Button>
							<Button
								type='button'
								variant='outline'
								size='sm'
								onClick={() => loadDemoAccount('cashier')}
								className='text-xs'>
								💰 Cashier
							</Button>
							<Button
								type='button'
								variant='outline'
								size='sm'
								onClick={() => loadDemoAccount('cook')}
								className='text-xs'>
								👨‍🍳 Cook
							</Button>
							<Button
								type='button'
								variant='outline'
								size='sm'
								onClick={() => loadDemoAccount('manager')}
								className='text-xs'>
								📊 Manager
							</Button>
						</div>
					</div>

					{/* Footer */}
					<div className='mt-6 text-center text-xs text-muted-foreground'>
						<p>
							By signing in, you agree to our{' '}
							<button className='text-primary hover:underline'>
								Terms of Service
							</button>{' '}
							and{' '}
							<button className='text-primary hover:underline'>
								Privacy Policy
							</button>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
