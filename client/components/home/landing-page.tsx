/** @format */

// components/home/landing-page.tsx
'use client';

import Link from 'next/link';
import { Coffee, BarChart3, Users, Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPageContent() {
	return (
		<div className='min-h-screen bg-gradient-to-b from-background to-muted/20'>
			{/* Navigation */}
			<nav className='container mx-auto px-6 py-4'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-2'>
						<div className='w-8 h-8 bg-primary rounded-lg flex items-center justify-center'>
							<Coffee className='w-5 h-5 text-white' />
						</div>
						<span className='text-xl font-bold text-foreground'>Café POS</span>
					</div>
					<div className='flex items-center gap-4'>
						<Link href='/auth/login'>
							<Button variant='ghost'>Login</Button>
						</Link>
						<Link href='/auth/login'>
							<Button>
								Get Started
								<ArrowRight className='w-4 h-4 ml-2' />
							</Button>
						</Link>
					</div>
				</div>
			</nav>

			{/* Hero Section */}
			<section className='container mx-auto px-6 py-20 text-center'>
				<h1 className='text-5xl md:text-6xl font-bold text-foreground mb-6'>
					Modern POS for
					<span className='text-primary'> Cafés & Restaurants</span>
				</h1>
				<p className='text-xl text-muted-foreground max-w-2xl mx-auto mb-10'>
					Streamline operations, boost sales, and delight customers with our
					all-in-one restaurant management system.
				</p>
				<div className='flex flex-col sm:flex-row gap-4 justify-center'>
					<Link href='/auth/login'>
						<Button
							size='lg'
							className='px-8'>
							Start Free Trial
							<ArrowRight className='w-4 h-4 ml-2' />
						</Button>
					</Link>
					<Link href='#features'>
						<Button
							size='lg'
							variant='outline'>
							View Features
						</Button>
					</Link>
				</div>
			</section>

			{/* Features Grid */}
			<section
				id='features'
				className='container mx-auto px-6 py-16'>
				<h2 className='text-3xl font-bold text-center text-foreground mb-12'>
					Everything You Need to Run Your Business
				</h2>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
					{features.map((feature, index) => (
						<div
							key={index}
							className='bg-card border border-border rounded-xl p-6 text-center'>
							<div className='w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4'>
								{feature.icon}
							</div>
							<h3 className='text-lg font-semibold text-foreground mb-2'>
								{feature.title}
							</h3>
							<p className='text-muted-foreground'>{feature.description}</p>
						</div>
					))}
				</div>
			</section>

			{/* CTA Section */}
			<section className='bg-primary/5 border-t border-border py-20'>
				<div className='container mx-auto px-6 text-center'>
					<h2 className='text-3xl font-bold text-foreground mb-6'>
						Ready to Transform Your Business?
					</h2>
					<p className='text-xl text-muted-foreground max-w-2xl mx-auto mb-8'>
						Join hundreds of restaurants using Café POS to streamline their
						operations.
					</p>
					<Link href='/auth/login'>
						<Button
							size='lg'
							className='px-10'>
							Get Started for Free
							<ArrowRight className='w-4 h-4 ml-2' />
						</Button>
					</Link>
				</div>
			</section>
		</div>
	);
}

const features = [
	{
		icon: <Coffee className='w-6 h-6 text-primary' />,
		title: 'Intuitive POS',
		description:
			'Fast, reliable point of sale with table management and order tracking',
	},
	{
		icon: <BarChart3 className='w-6 h-6 text-primary' />,
		title: 'Real-time Analytics',
		description:
			'Track sales, inventory, and customer trends with live dashboards',
	},
	{
		icon: <Users className='w-6 h-6 text-primary' />,
		title: 'Staff Management',
		description: 'Manage roles, shifts, and permissions with ease',
	},
	{
		icon: <Shield className='w-6 h-6 text-primary' />,
		title: 'Secure & Reliable',
		description: 'Enterprise-grade security with 99.9% uptime guarantee',
	},
];
