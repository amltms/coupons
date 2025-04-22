import { useRef } from 'react';
import { Coupon } from '../types/Coupon';
import confetti from 'canvas-confetti';

type CouponCardProps = {
	coupon: Coupon;
	usesLeft: number;
	timesUsed: number;
	onUse: (id: number) => void;
};

export default function CouponCard({ coupon, usesLeft, timesUsed, onUse }: CouponCardProps) {
	const buttonRef = useRef<HTMLButtonElement>(null);

	const handleClick = () => {
		if (coupon.uses !== undefined && usesLeft <= 0) return;

		if (buttonRef.current) {
			const rect = buttonRef.current.getBoundingClientRect();
			confetti({
				particleCount: 100,
				spread: 75,
				startVelocity: 35,
				origin: {
					x: (rect.left + rect.width / 2) / window.innerWidth,
					y: (rect.top + rect.height / 2) / window.innerHeight,
				},
				colors: ['#FFC1CC', '#FFB6B9', '#FFDEE9', '#C1E1FF'],
			});
		}

		onUse(coupon.id);
	};

	const backgrounds = [
		'linear-gradient(135deg, #FFDEE9 0%, #B5FFFC 100%)',
		'linear-gradient(135deg, #C1E1FF 0%, #FFF7AE 100%)',
		'linear-gradient(135deg, #FFB6B9 0%, #FFD6E0 100%)',
		'linear-gradient(135deg, #C2FFD8 0%, #FFC2E2 100%)',
	];

	const isDepleted = coupon.uses !== undefined && usesLeft <= 0;

	return (
		<div
			className={`relative rounded-3xl p-6 shadow-md transition overflow-hidden ${isDepleted ? 'opacity-60' : 'hover:shadow-lg'}`}
			style={{
				background: isDepleted ? 'linear-gradient(135deg, #f3f4f6, #e5e7eb)' : backgrounds[coupon.id % backgrounds.length],
			}}
		>
			{isDepleted && <div className="absolute top-3 right-3 bg-pink-500 text-white text-xs px-3 py-1 rounded-full">Used</div>}

			<h2 className="text-2xl font-bold mb-2 text-rose-900">{coupon.title}</h2>
			<p className="mb-4 text-rose-800 text-sm">{coupon.description}</p>

			<div className="flex items-center justify-between mb-4">
				{coupon.unlimited ? (
					<p className="text-xs text-rose-700 font-medium">Unlimited uses</p>
				) : (
					<p className="text-xs text-rose-700 font-medium">
						{usesLeft}/{coupon.uses} uses left
					</p>
				)}

				{/* Quantity badge */}
				<div className="text-[11px] bg-white text-rose-700 font-semibold px-2 py-0.5 rounded-full shadow">Used: {timesUsed}</div>
			</div>

			<button
				ref={buttonRef}
				disabled={isDepleted}
				onClick={handleClick}
				className={`w-full px-5 py-2 rounded-full text-sm font-medium transition ${
					isDepleted ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-pink-600 text-white hover:brightness-110 cursor-pointer shadow-md'
				}`}
			>
				{isDepleted ? 'Used Up' : 'Use Coupon'}
			</button>
		</div>
	);
}
