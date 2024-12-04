import {
	GoldRushClient,
	ChainName,
	ChainID,
	Quote,
} from "@covalenthq/client-sdk";

export { ChainName } from "@covalenthq/client-sdk";

/**
 * The Covalent agent
 */
export class Agent {
	private client: GoldRushClient;

	/**
	 * Initializes a new instances of the Agent class.
	 * @param key The GoldRush API key
	 */
	constructor(key: string) {
		this.client = new GoldRushClient(key);
	}

	/**
	 * The total balance of an ERC20 token that belongs to a given WalletAddress
	 * @param chainName The chain to lookup
	 * @param options Contains the wallet address and contract address.
	 */
	async getTokenBalancesForChain(
		chainName: ChainName,
		{
			walletAddress,
			contractAddress,
		}: { walletAddress: string; contractAddress: string },
	) {
		const historicals = await this.getHistoricalTokenBalancesForAddress(
			chainName,
			{ walletAddress },
		);
		let sum = 0n;
		for (const historical of historicals?.items ?? []) {
			if (historical.contract_address === contractAddress) {
				sum += historical.balance ?? 0n;
			}
		}
		return sum;
	}

	/**
	 * Gets the historical token balances for the supplied address.
	 * @param chainName The chain that we're going to be working with
	 * @param param1 A set of options that simply includes the walletAddress
	 * @returns some and metadata that represents the list of historical balances
	 */
	async getHistoricalTokenBalancesForAddress(
		chainName: ChainName,
		{ walletAddress }: { walletAddress: string },
	) {
		const resp =
			await this.client.BalanceService.getHistoricalTokenBalancesForWalletAddress(
				chainName,
				walletAddress,
			);
		return resp.data;
	}

	/**
	 * Gets the token holdings for a given wallet addres on a chain.
	 * @param chainName The chain to lookup
	 * @param options  Contains the wallet address and the currency to work with
	 */
	async getTokenHoldings(
		chainName: ChainName,
		{ walletAddress, currency }: { walletAddress: string; currency: Quote },
	) {
		const historicals = await this.getHistoricalTokenBalancesForAddress(
			chainName,
			{
				walletAddress,
			},
		);

		// TODO: NAV should get a breakdown by asset.

		const holdings = new Map<
			string,
			Exclude<Exclude<typeof historicals, null>["items"], null>[number] & {
				value: {
					amount: number;
					currency: Quote;
				};
			}
		>();

		for (const historical of historicals?.items ?? []) {
			if (!historical.contract_address) continue;
			if (!historical.contract_decimals) continue;
			if (!historical.balance) continue;

			const holding = {
				...historical,
				value: {
					amount: 0,
					currency: currency,
				},
			};

			holdings.set(historical.contract_address, holding);

			const quotes = await this.getQuote(chainName, {
				contractAddress: historical.contract_address,
				currency,
			});
			if (!quotes) continue;

			let total = 0;
			let count = 0;

			for (const quote of quotes) {
				for (const item of quote.items ?? []) {
					if (item.price === null) continue;
					total += item.price;
					count++;
				}
			}

			// TODO: determine if it's better to conver the numberator to a number or
			//   or… the denominator to BigInt
			holding.value.amount =
				count === 0
					? 0
					: (Number(historical.balance) / 10 ** historical.contract_decimals) *
					  (total / count);
		}

		return [...holdings].map(([, v]) => v);
	}

	/**
	 *
	 * @param chainName The name of the
	 * @param param1
	 * @returns
	 */
	async transactionHistory(
		chainName: ChainName,
		{ walletAddress }: { walletAddress: string },
	) {
		const it =
			await this.client.TransactionService.getAllTransactionsForAddress(
				chainName,
				walletAddress,
			);

		return it;
	}

	async getQuote(
		chainNane: ChainName,
		{ contractAddress, currency }: { contractAddress: string; currency: Quote },
	) {
		// TODO: handle errors.
		return (
			await this.client.PricingService.getTokenPrices(
				chainNane,
				currency,
				contractAddress,
			)
		).data;
	}

	portfolioGrowth() {}

	trends() {
		throw new Error("Trends not yet implemented");
	}

	portfolioView() {
		throw new Error("Portfolio view not yet implemented");
	}

	lpPools() {
		throw new Error("LP Pools not yet implemented");
	}
}
