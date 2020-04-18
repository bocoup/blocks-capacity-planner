'use strict';

const algorithms = {
	/**
	 * Prefer the least expensive producers.
	 */
	cheap({date, consumer, producers}) {
		let unmet = consumer.need;

		return producers
			.slice()
			.sort((a, b) => a.price > b.price ? 1 : -1)
			.map((producer) => {
				if (unmet < 1) {
					return null;
				}
				const quantity = Math.min(unmet, producer.capacity);
				unmet -= quantity;

				return {
					date,
					consumerId: consumer.id,
					producerId: producer.id,
					quantity
				};
			})
			.filter((element) => !!element);
	},

	/**
	 * Distribute orders to utilize all producers evenly according to the
	 * capacity of each.
	 */
	fair({date, consumer, producers}) {
		const totalCapacity = producers
			.reduce((total, producer) => total + producer.capacity, 0);
		const targetUtilization = consumer.need / totalCapacity;

		return producers.map((producer) => ({
			date,
			consumerId: consumer.id,
			producerId: producer.id,
			quantity: Math.round(producer.capacity * targetUtilization)
		}));
	}
};

/**
 * @param {string} strategy - one of "fair" or"cheap"
 */
export default function fillOrders({strategy, assignments, producers, consumers}) {
	const deliveries = new Map();
	assignments.forEach((assignment) => {
		const id = assignment.date + assignment.consumerId;
		const producer = producers
			.find(({id}) => id === assignment.producerId);

		if (!deliveries.has(id)) {
			const consumer = consumers
				.find(({id}) => id === assignment.consumerId);

			deliveries.set(id, {
				consumer,
				date: assignment.date,
				producers: [producer]
			});
		} else {
			deliveries.get(id).producers.push(producer);
		}
	});

	return [...deliveries.values()]
		.map(algorithms[strategy])
		.flat();
}
