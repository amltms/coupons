import { Coupon } from '../types/Coupon';
import confetti from 'canvas-confetti';

type CouponCardProps = {
	coupon: Coupon;
	isUsed: boolean;
	onUse: (id: number) => void;
};

export default function CouponCard({ coupon, isUsed, onUse }: CouponCardProps) {
	const handleClick = () => {
		if (isUsed) return;

		confetti({
			particleCount: 100,
			spread: 70,
			origin: { y: 0.6 },
			colors: ['#FFC1CC', '#FFB6B9', '#FFDEE9', '#C1E1FF'],
		});

		onUse(coupon.id);
	};

	const backgrounds = [
		'linear-gradient(135deg, #FFDEE9 0%, #B5FFFC 100%)',
		'linear-gradient(135deg, #C1E1FF 0%, #FFF7AE 100%)',
		'linear-gradient(135deg, #FFB6B9 0%, #FFD6E0 100%)',
		'linear-gradient(135deg, #C2FFD8 0%, #FFC2E2 100%)',
	];

	return (
		<div
			className={`relative rounded-3xl p-6 shadow-md transition overflow-hidden ${isUsed ? 'opacity-70' : 'hover:shadow-lg'}`}
			style={{
				background: isUsed ? 'linear-gradient(135deg, #f3f4f6, #e5e7eb)' : backgrounds[coupon.id % backgrounds.length],
			}}
		>
			{isUsed && <div className="absolute top-3 right-3 bg-pink-500 text-white text-xs px-3 py-1 rounded-full">Used 💖</div>}

			<h2 className="text-2xl font-bold mb-2 text-pink-900">{coupon.title}</h2>
			<p className="mb-4 text-pink-800 text-md">{coupon.description}</p>
			<button
				disabled={isUsed}
				onClick={handleClick}
				className={`px-5 py-2 rounded-full text-sm font-medium transition ${
					isUsed ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-pink-500 text-white hover:brightness-90 cursor-pointer'
				}`}
			>
				{isUsed ? 'Already Used' : 'Use Coupon'}
			</button>
		</div>
	);
}
