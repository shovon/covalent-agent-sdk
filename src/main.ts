import { GoldRushClient } from "@covalenthq/client-sdk";

export class Agent {
	private client: GoldRushClient;

	constructor(key: string) {
		this.client = new GoldRushClient(key);
	}

	tokenBalances() {
		throw new Error("Token balances not yet implemented");
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
