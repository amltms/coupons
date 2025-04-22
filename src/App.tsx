import { useEffect, useState } from 'react';
import CouponCard from './components/CouponCard';
import couponsData from './data/coupons.json';
import { Coupon } from './types/Coupon';

function App() {
	const [searchTerm, setSearchTerm] = useState('');
	const [couponUses, setCouponUses] = useState<{ [key: number]: number }>({});

	useEffect(() => {
		const storedUses = JSON.parse(localStorage.getItem('couponUses') || '{}');
		setCouponUses(storedUses);
	}, []);

	const handleUseCoupon = (id: number) => {
		const coupon = couponsData.find((c) => c.id === id);
		if (!coupon) return;

		const current = couponUses[id] || 0;

		// If it's not unlimited and reached its limit, do nothing
		if (!coupon.unlimited && coupon.uses !== undefined && current >= coupon.uses) return;

		const updatedUses = { ...couponUses, [id]: current + 1 };
		setCouponUses(updatedUses);
		localStorage.setItem('couponUses', JSON.stringify(updatedUses));
	};

	const filteredCoupons = couponsData.filter(
		(coupon: Coupon) => coupon.title.toLowerCase().includes(searchTerm.toLowerCase()) || coupon.description.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const categories = Array.from(new Set(filteredCoupons.map((c) => c.category)));

	return (
		<div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 p-4">
			<div className="max-w-xl mx-auto space-y-6">
				<h1 className="text-4xl font-bold text-center text-rose-800 mb-4">🌸 Rose's Coupons 🌸</h1>

				<input
					type="text"
					placeholder="Search coupons..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="w-full p-3 rounded-full border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-300 mb-6"
				/>

				{categories.map((category) => (
					<div key={category}>
						<h2 className="text-2xl text-pink-700 font-semibold mb-3">{category}</h2>
						<div className="grid gap-4 sm:grid-cols-1">
							{filteredCoupons
								.filter((coupon) => coupon.category === category)
								.map((coupon) => (
									<CouponCard
										key={coupon.id}
										coupon={coupon}
										usesLeft={
											coupon.unlimited
												? Infinity // unlimited so no upper limit
												: (coupon.uses || 1) - (couponUses[coupon.id] || 0)
										}
										timesUsed={couponUses[coupon.id] || 0} // <- add this
										onUse={handleUseCoupon}
									/>
								))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default App;
