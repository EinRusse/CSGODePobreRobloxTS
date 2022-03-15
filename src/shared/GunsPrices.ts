export const prices = {
	// Price position = Weapon Position
	count: 14,
	prices: [2],
	names: ["AK-T"],
	find(tool: string): number | undefined {
		let result;
		this.names.forEach((finder, index) => {
			const finded = finder.find(tool);
			if (finded[0] !== undefined) {
				result = this.prices[index];
			}
		});
		return result;
	},
};
