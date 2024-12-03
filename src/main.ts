import { GoldRushClient, ChainName, ChainID } from "@covalenthq/client-sdk";

export class Agent {
	private client: GoldRushClient;

	constructor(key: string) {
		this.client = new GoldRushClient(key);
	}

	/**
	 * The balances of the token
	 * @param chainName The chain to lookup
	 * @param walletAddress The wallet address for which to look up
	 * @param contractAddress The address of the ERC20 contract
	 */
	async tokenBalances(
		chainName: ChainName,
		walletAddress: string,
		contractAddress: string,
	) {
		const it = this.client.BalanceService.getErc20TransfersForWalletAddress(
			ChainName.ETH_MAINNET,
			walletAddress,
		);

		for await (const el of it) {
			(el.data?.items ?? []).map(e => e.transfers?.map(t => t.balance));
		}
	}

	netAssetValue() {
		throw new Error("NAV not yet implemented");
	}

	transactionHistory() {
		throw new Error("Transaction history not yet implemented");
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
