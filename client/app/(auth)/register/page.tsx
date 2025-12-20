/** @format */

// app/(auth)/register/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { ROLES } from '@/lib/constants';

export default function RegisterPage() {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
		role: 'cashier',
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Registration logic here
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-[#EBD5AB] to-[#8BAE66]/20 p-4'>
			<div className='w-full max-w-md'>
				<Link
					href='/login'
					className='inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8'>
					<ArrowLeft className='h-4 w-4 mr-2' />
					Back to login
				</Link>

				<div className='café-card p-8 shadow-xl'>
					<div className='text-center mb-8'>
						<div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-café rounded-2xl shadow-lg mb-4'>
							<Coffee className='h-8 w-8 text-white' />
						</div>
						<h1 className='text-2xl font-bold text-foreground'>
							Create Account
						</h1>
						<p className='text-muted-foreground mt-2'>
							Register a new staff member
						</p>
					</div>

					<form
						onSubmit={handleSubmit}
						className='space-y-6'>
						<div className='space-y-2'>
							<Label htmlFor='name'>Full Name *</Label>
							<Input
								id='name'
								name='name'
								value={formData.name}
								onChange={handleChange}
								placeholder='John Smith'
								required
							/>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='email'>Email Address *</Label>
							<Input
								id='email'
								name='email'
								type='email'
								value={formData.email}
								onChange={handleChange}
								placeholder='john@cafe.com'
								required
							/>
						</div>

						<div className='grid grid-cols-2 gap-4'>
							<div className='space-y-2'>
								<Label htmlFor='password'>Password *</Label>
								<Input
									id='password'
									name='password'
									type='password'
									value={formData.password}
									onChange={handleChange}
									required
								/>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='confirmPassword'>Confirm *</Label>
								<Input
									id='confirmPassword'
									name='confirmPassword'
									type='password'
									value={formData.confirmPassword}
									onChange={handleChange}
									required
								/>
							</div>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='role'>Role *</Label>
							<Select
								value={formData.role}
								onValueChange={(value) =>
									setFormData({ ...formData, role: value })
								}>
								<SelectTrigger>
									<SelectValue placeholder='Select role' />
								</SelectTrigger>
								<SelectContent>
									{ROLES.map((role) => (
										<SelectItem
											key={role.value}
											value={role.value}>
											{role.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<Button
							type='submit'
							className='w-full bg-gradient-café hover:opacity-90'
							size='lg'>
							Create Account
						</Button>

						<div className='text-center text-sm text-muted-foreground'>
							<p>
								Already have an account?{' '}
								<Link
									href='/login'
									className='text-primary hover:underline'>
									Sign in
								</Link>
							</p>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
