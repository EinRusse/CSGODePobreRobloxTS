export const count = {
	rounds: 0,
	set(num: number) {
		this.rounds = num;
	},
	add(num: number) {
		return (this.rounds += num);
	},
	get() {
		return this.rounds;
	},
};
