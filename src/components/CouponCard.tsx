import { useRef } from 'react';
import { Coupon } from '../types/Coupon';
import confetti from 'canvas-confetti';
import { formatCooldown } from '../utils/formatCooldown';

type CouponCardProps = {
	coupon: Coupon;
	usesLeft: number;
	timesUsed: number;
	onUse: (id: number) => void;
	remainingCooldown: number;
};

export default function CouponCard({ coupon, usesLeft, timesUsed, onUse, remainingCooldown }: CouponCardProps) {
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
	const isCooldownActive = remainingCooldown > 0;
	return (
		<div
			className={`relative rounded-3xl p-5 shadow-md transition overflow-hidden ${isDepleted ? 'opacity-60' : 'hover:shadow-lg'}`}
			style={{
				background: isDepleted ? 'linear-gradient(135deg, #f3f4f6, #e5e7eb)' : backgrounds[coupon.id % backgrounds.length],
			}}
		>
			<div className="absolute top-5 right-5 text-[11px] w-fit bg-white/60 text-rose-700 font-semibold px-2 py-0.5 rounded-full">
				{isDepleted ? 'Used' : usesLeft != Infinity ? usesLeft + 'x' : `Unlimited: ${timesUsed}`}
			</div>

			<h2 className="text-2xl font-semibold mb-2 text-rose-900">{coupon.title}</h2>
			<p className="mb-4 text-rose-700 text-sm">{coupon.description}</p>

			<div className="flex items-end justify-between mt-4">
				<button
					ref={buttonRef}
					disabled={isDepleted || isCooldownActive}
					onClick={handleClick}
					className={`w-fit px-5 py-2 rounded-full text-sm font-medium transition-all ${
						isDepleted || isCooldownActive ? 'bg-white/20 text-gray-600' : 'bg-white/60 text-black/80 hover:bg-white cursor-pointer'
					}`}
				>
					{isDepleted ? 'Used' : isCooldownActive ? 'Cooldown' : 'Use Coupon'}
					{isCooldownActive && usesLeft != 0 && <span className="text-xs text-gray-500 ml-2">({formatCooldown(remainingCooldown)})</span>}
				</button>
				<div className="flex gap-2">
					{coupon.cooldown !== undefined && usesLeft != 0 && (
						<div className="text-[11px] w-fit bg-white/60 text-rose-700 font-semibold px-2 py-0.5 rounded-full">{formatCooldown(coupon.cooldown)}</div>
					)}
					{/* {coupon.unlimited && timesUsed != 0 && <p className="text-[11px] w-fit bg-white/60 text-rose-700 font-semibold px-2 py-0.5 rounded-full">{timesUsed}x</p>} */}
				</div>
			</div>
		</div>
	);
}
