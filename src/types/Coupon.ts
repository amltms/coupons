export type Coupon = {
	id: number;
	title: string;
	description: string;
	category: string;
	unlimited?: boolean;
	uses?: number; // max uses if not unlimited
	cooldown?: number; // cooldown time in milliseconds (optional)
};
