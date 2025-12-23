/** @format */

// app/auth/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/lib/api/services';
import { Mail, Lock, User, Coffee, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

export default function RegisterPage() {
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
		role: 'cashier' as 'cashier' | 'cook' | 'manager' | 'admin',
		pin: '',
	});

	// Registration mutation
	const registerMutation = useMutation({
		mutationFn: () => {
			// Validate passwords match
			if (formData.password !== formData.confirmPassword) {
				throw new Error('Passwords do not match');
			}

			// Prepare registration data
			const registrationData = {
				name: formData.name,
				email: formData.email,
				password: formData.password,
				role: formData.role,
				pin: formData.pin || undefined,
			};

			return authService.register(registrationData);
		},
		onSuccess: (data) => {
			// Auto-login after successful registration
			localStorage.setItem('token', data.data.token);
			localStorage.setItem('user', JSON.stringify(data.data.user));

			// Redirect to dashboard
			router.push('/dashboard');
		},
		onError: (error: any) => {
			console.error('Registration error:', error);
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		registerMutation.mutate();
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-4'>
			<div className='w-full max-w-md'>
				{/* Back to Login */}
				<div className='mb-4'>
					<Link
						href='/auth/login'
						className='inline-flex items-center text-sm text-primary hover:underline'>
						<ArrowLeft className='w-4 h-4 mr-1' />
						Back to Login
					</Link>
				</div>

				{/* Logo */}
				<div className='text-center mb-8'>
					<div className='inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4'>
						<Coffee className='w-8 h-8 text-white' />
					</div>
					<h1 className='text-3xl font-bold text-foreground'>Create Account</h1>
					<p className='text-muted-foreground mt-2'>
						Register new staff member for Café POS
					</p>
				</div>

				{/* Registration Card */}
				<Card>
					<CardContent className='p-6'>
						<form
							onSubmit={handleSubmit}
							className='space-y-4'>
							{/* Name */}
							<div>
								<label className='block text-sm font-medium text-foreground mb-2'>
									Full Name *
								</label>
								<div className='relative'>
									<User className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground' />
									<Input
										type='text'
										name='name'
										value={formData.name}
										onChange={handleInputChange}
										className='pl-10'
										placeholder='John Doe'
										required
									/>
								</div>
							</div>

							{/* Email */}
							<div>
								<label className='block text-sm font-medium text-foreground mb-2'>
									Email Address *
								</label>
								<div className='relative'>
									<Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground' />
									<Input
										type='email'
										name='email'
										value={formData.email}
										onChange={handleInputChange}
										className='pl-10'
										placeholder='staff@cafe.com'
										required
									/>
								</div>
							</div>

							{/* Password */}
							<div>
								<label className='block text-sm font-medium text-foreground mb-2'>
									Password *
								</label>
								<div className='relative'>
									<Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground' />
									<Input
										type={showPassword ? 'text' : 'password'}
										name='password'
										value={formData.password}
										onChange={handleInputChange}
										className='pl-10 pr-10'
										placeholder='Minimum 6 characters'
										minLength={6}
										required
									/>
									<button
										type='button'
										onClick={() => setShowPassword(!showPassword)}
										className='absolute right-3 top-1/2 transform -translate-y-1/2'>
										{showPassword ?
											<EyeOff className='w-5 h-5 text-muted-foreground' />
										:	<Eye className='w-5 h-5 text-muted-foreground' />}
									</button>
								</div>
							</div>

							{/* Confirm Password */}
							<div>
								<label className='block text-sm font-medium text-foreground mb-2'>
									Confirm Password *
								</label>
								<div className='relative'>
									<Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground' />
									<Input
										type={showConfirmPassword ? 'text' : 'password'}
										name='confirmPassword'
										value={formData.confirmPassword}
										onChange={handleInputChange}
										className='pl-10 pr-10'
										placeholder='Re-enter your password'
										required
									/>
									<button
										type='button'
										onClick={() => setShowConfirmPassword(!showConfirmPassword)}
										className='absolute right-3 top-1/2 transform -translate-y-1/2'>
										{showConfirmPassword ?
											<EyeOff className='w-5 h-5 text-muted-foreground' />
										:	<Eye className='w-5 h-5 text-muted-foreground' />}
									</button>
								</div>
							</div>

							{/* Role Selection */}
							<div>
								<label className='block text-sm font-medium text-foreground mb-2'>
									Role *
								</label>
								<select
									name='role'
									value={formData.role}
									onChange={handleInputChange}
									className='w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm'
									required>
									<option value='cashier'>Cashier</option>
									<option value='cook'>Cook</option>
									<option value='manager'>Manager</option>
									<option value='admin'>Admin</option>
								</select>
							</div>

							{/* PIN (Optional) */}
							<div>
								<label className='block text-sm font-medium text-foreground mb-2'>
									PIN Code (Optional)
								</label>
								<Input
									type='text'
									name='pin'
									value={formData.pin}
									onChange={handleInputChange}
									placeholder='4-digit PIN for quick login'
									maxLength={4}
									pattern='[0-9]*'
								/>
								<p className='text-xs text-muted-foreground mt-1'>
									Optional 4-digit PIN for quick terminal login
								</p>
							</div>

							{/* Error Message */}
							{registerMutation.error && (
								<div className='p-3 bg-destructive/10 border border-destructive/20 rounded-lg'>
									<p className='text-destructive text-sm'>
										{registerMutation.error.message ||
											'Registration failed. Please try again.'}
									</p>
								</div>
							)}

							{/* Submit Button */}
							<Button
								type='submit'
								className='w-full'
								disabled={registerMutation.isPending}>
								{registerMutation.isPending ?
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
										Creating Account...
									</span>
								:	'Create Account'}
							</Button>

							{/* Login Link */}
							<div className='text-center pt-4 border-t border-border'>
								<p className='text-sm text-muted-foreground'>
									Already have an account?{' '}
									<Link
										href='/auth/login'
										className='text-primary hover:underline'>
										Sign in
									</Link>
								</p>
							</div>
						</form>
					</CardContent>
				</Card>

				{/* Demo Info */}
				<div className='mt-6 p-4 bg-muted/30 rounded-lg border border-border'>
					<p className='text-sm text-muted-foreground text-center'>
						<strong>Note:</strong> Registration requires admin privileges. Use
						admin credentials to register new staff.
					</p>
				</div>
			</div>
		</div>
	);
}
