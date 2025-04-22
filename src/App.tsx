import { useEffect, useState } from 'react';
import CouponCard from './components/CouponCard';
import couponsData from './data/coupons.json';
import { Coupon } from './types/Coupon';

function App() {
	const [searchTerm, setSearchTerm] = useState('');
	const [couponUses, setCouponUses] = useState<{ [key: number]: number }>({});
	const [lastUsedTime, setLastUsedTime] = useState<{ [key: number]: number }>({});
	const [remainingCooldowns, setRemainingCooldowns] = useState<{ [key: number]: number }>({});

	useEffect(() => {
		const storedUses = JSON.parse(localStorage.getItem('couponUses') || '{}');
		const storedLastUsed = JSON.parse(localStorage.getItem('lastUsedTime') || '{}');
		setCouponUses(storedUses);
		setLastUsedTime(storedLastUsed);
	}, []);

	useEffect(() => {
		const intervalId = setInterval(() => {
			const updatedCooldowns: { [key: number]: number } = {};

			couponsData.forEach((coupon) => {
				const lastUsed = lastUsedTime[coupon.id] || 0;
				if (coupon.cooldown) {
					const remainingTime = calculateRemainingTime(coupon, lastUsed);
					updatedCooldowns[coupon.id] = remainingTime;
				}
			});

			setRemainingCooldowns(updatedCooldowns);
		}, 1000); // Update every second

		return () => clearInterval(intervalId);
	}, [lastUsedTime]);

	const handleUseCoupon = (id: number) => {
		const coupon = couponsData.find((c) => c.id === id);
		if (!coupon) return;

		const current = couponUses[id] || 0;
		const lastUsed = lastUsedTime[id] || 0;

		// If cooldown is active, prevent use
		if (coupon.cooldown && Date.now() - lastUsed < coupon.cooldown) {
			alert('You need to wait before using this coupon again.');
			return;
		}

		// If it's not unlimited and reached its limit, do nothing
		if (!coupon.unlimited && coupon.uses !== undefined && current >= coupon.uses) return;

		const updatedUses = { ...couponUses, [id]: current + 1 };
		const updatedLastUsed = { ...lastUsedTime, [id]: Date.now() };

		setCouponUses(updatedUses);
		setLastUsedTime(updatedLastUsed);

		localStorage.setItem('couponUses', JSON.stringify(updatedUses));
		localStorage.setItem('lastUsedTime', JSON.stringify(updatedLastUsed));
	};

	// Calculate remaining cooldown time for each coupon
	const calculateRemainingTime = (coupon: Coupon, lastUsed: number) => {
		if (!coupon.cooldown) return 0;

		const timePassed = Date.now() - lastUsed;
		const remainingTime = coupon.cooldown - timePassed;

		return remainingTime > 0 ? remainingTime : 0;
	};

	// Format remaining cooldown time in short format (e.g., 1m, 30s)
	const filteredCoupons = couponsData.filter(
		(coupon: Coupon) => coupon.title.toLowerCase().includes(searchTerm.toLowerCase()) || coupon.description.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const categories = Array.from(new Set(filteredCoupons.map((c) => c.category)));

	return (
		<div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 p-4">
			<div className="max-w-xl mx-auto space-y-6">
				<h1 className="text-4xl font-bold text-center text-rose-800 mb-4">Coupons</h1>

				<input
					type="text"
					placeholder="Search coupons..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="w-full p-5 rounded-full border-none bg-pink-100 focus:outline-none  mb-6"
				/>

				{categories.map((category) => (
					<div key={category}>
						<h2 className="text-2xl text-pink-700 font-semibold mb-3">{category}</h2>
						<div className="grid gap-4 sm:grid-cols-1">
							{filteredCoupons
								.filter((coupon) => coupon.category === category)
								.map((coupon) => {
									const lastUsed = lastUsedTime[coupon.id] || 0;
									const remainingTime = remainingCooldowns[coupon.id] || calculateRemainingTime(coupon, lastUsed);

									return (
										<CouponCard
											key={coupon.id}
											coupon={coupon}
											usesLeft={
												coupon.unlimited
													? Infinity // unlimited so no upper limit
													: (coupon.uses || 1) - (couponUses[coupon.id] || 0)
											}
											timesUsed={couponUses[coupon.id] || 0}
											onUse={handleUseCoupon}
											remainingCooldown={remainingTime}
										/>
									);
								})}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default App;
