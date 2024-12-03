import { GoldRushClient, ChainName, ChainID } from "@covalenthq/client-sdk";

export { ChainName } from "@covalenthq/client-sdk";

export class Agent {
	private client: GoldRushClient;

	constructor(key: string) {
		this.client = new GoldRushClient(key);
	}

	/**
	 * The total balance of an ERC20 token that belongs to a given WalletAddress
	 * @param chainName The chain to lookup
	 * @param options Contains the wallet address and contract address.
	 */
	async getTokenBalances(
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
	 *
	 * @param chainName The chain to lookup
	 * @param options  Contains the wallet address
	 */
	async getNetAssetValue(
		chainName: ChainName,
		{ walletAddress }: { walletAddress: string },
	) {
		const historicals = await this.getHistoricalTokenBalancesForAddress(
			chainName,
			{
				walletAddress,
			},
		);
		for (const historical of historicals?.items ?? []) {
			// console.log(historical.contract_ticker_symbol);
		}

		throw new Error("NAV not yet implemented");
	}

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

	portfolioGrowth() {
		throw new Error("Portfolio growth not yet implemented");
	}

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
