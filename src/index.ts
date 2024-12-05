import {
	GoldRushClient,
	ChainName,
	ChainID,
	Quote,
	GoldRushResponse,
} from "@covalenthq/client-sdk";

export { ChainName } from "@covalenthq/client-sdk";

import { z } from "zod";
import {
	nftFloorPriceSchema,
	nftResponseSchema,
	transactionResponseSchema,
} from "./schema";

/**
 * The Covalent agent
 */
export class Agent {
	private client: GoldRushClient;

	/**
	 * Initializes a new instances of the Agent class.
	 * @param key The GoldRush API key
	 */
	constructor(private key: string) {
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
	async getSpotBalances(
		chainName: ChainName,
		{
			walletAddress,
			currency,
		}: {
			walletAddress: string;
			currency: Quote;
		},
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
	 * Retrieves the transaction history for a given wallet address on a specified blockchain.
	 *
	 * @param {ChainName} chainName - The name of the blockchain to query.
	 * @param {Object} params - The parameters for the query.
	 * @param {string} params.walletAddress - The wallet address to retrieve the transaction history for.
	 * @returns {Promise<any>} A promise that resolves to the transaction history.
	 */
	async getTransactionsForWallet(
		chainName: ChainName,
		{
			walletAddress,
		}: {
			walletAddress: string;
		},
	) {
		const it =
			await this.client.TransactionService.getAllTransactionsForAddress(
				chainName,
				walletAddress,
			);

		return it;
	}

	/**
	 * Retrieves transaction history across all supported blockchains for a given wallet address.
	 *
	 * @param {string} walletAddress - The wallet address to retrieve transactions for
	 * @returns {Promise<z.infer<typeof transactionResponseSchema>>} A promise that resolves to the transaction history across all chains.
	 *   The response follows the transactionResponseSchema structure which includes:
	 *   - Updated timestamp
	 *   - Pagination cursors
	 *   - Quote currency
	 *   - Array of transaction items with detailed metadata
	 */
	async getAllChainsTransactions(walletAddress: string) {
		const options = {
			method: "GET",
			headers: {
				Authorization: `Bearer ${this.key}`,
			},
		};

		this.client.AllChainsService.getMultiChainAndMultiAddressTransactions();

		return await fetch(
			`https://api.covalenthq.com/v1/allchains/transactions/?addresses=${encodeURIComponent(
				walletAddress,
			)}`,
			options,
		).then(async response => {
			return transactionResponseSchema.parse(await response.json());
		});
	}

	/**
	 * Retrieves NFT balances and metadata for a given wallet address on a specific blockchain.
	 *
	 * @param {ChainName} chainName - The blockchain network to query
	 * @param {Object} params - The parameters for the NFT request
	 * @param {string} params.walletAddress - The wallet address to get NFTs for
	 * @returns {Promise<z.infer<typeof nftResponseSchema>>} A promise that resolves to the NFT data.
	 *   The response follows the nftResponseSchema structure which includes:
	 *   - Updated timestamp
	 *   - Array of NFT items with:
	 *     - Contract details (name, symbol, address)
	 *     - Balance information
	 *     - Floor prices
	 *     - Token-specific data (ID, balance, URLs, ownership)
	 */
	async getNFTForWallet(
		chainName: ChainName,
		{ walletAddress }: { walletAddress: string },
	) {
		const options = {
			method: "GET",
			headers: {
				Authorization: `Bearer ${this.key}`,
			},
		};

		return nftResponseSchema.parse(
			JSON.parse(
				await fetch(
					`https://api.covalenthq.com/v1/${chainName}/address/${walletAddress}/balances_nft/`,
					options,
				).then(response => response.text()),
			),
		);
	}

	/**
	 * Gets the floor price history for an NFT collection on a specific blockchain.
	 *
	 * @param {ChainName} chainName - The blockchain network to query
	 * @param {Object} params - The parameters for the floor price request
	 * @param {string} params.contractAddress - The contract address of the NFT collection
	 * @returns {Promise<z.infer<typeof nftFloorPriceSchema>>} A promise that resolves to the floor price data.
	 *   The response follows the nftFloorPriceSchema structure which includes:
	 *   - Contract address
	 *   - Updated timestamp
	 *   - Quote currency
	 *   - Chain information
	 *   - Array of floor price items with:
	 *     - Date
	 *     - Native token details
	 *     - Floor prices in native and quote currency
	 */
	async getNFTFloorPrice(
		chainName: ChainName,
		{ contractAddress }: { contractAddress: string },
	) {
		const options = {
			method: "GET",
			headers: {
				Authorization: `Bearer ${this.key}`,
			},
		};

		return nftFloorPriceSchema.parse(
			JSON.parse(
				await fetch(
					`https://api.covalenthq.com/v1/${chainName}/nft_market/${contractAddress}/floor_price/`,
					options,
				).then(response => {
					return response.text();
				}),
			),
		);
	}

	async getTokenApprovals(
		chainName: ChainName,
		{ walletAddress }: { walletAddress: string },
	) {
		const options = {
			method: "GET",
			headers: {
				Authorization: `Bearer ${this.key}`,
			},
		};

		return await fetch(
			`https://api.covalenthq.com/v1/${chainName}/approvals/${walletAddress}/`,
			options,
		).then(response => {
			return response.text();
		});
	}

	async getNFTApprovals(
		chainName: ChainName,
		{ walletAddress }: { walletAddress: string },
	) {
		const options = {
			method: "GET",
			headers: {
				Authorization: `Bearer ${this.key}`,
			},
		};

		return await fetch(
			`https://api.covalenthq.com/v1/${chainName}/nft/approvals/${walletAddress}/`,
			options,
		).then(response => {
			return response.text;
		});
	}

	/**
	 * Gets the current price quote for a token on a specific chain.
	 *
	 * @param {ChainName} chainNane - The blockchain network to query
	 * @param {Object} params - The parameters for the quote request
	 * @param {string} params.contractAddress - The contract address of the token
	 * @param {Quote} params.currency - The currency to get the price quote in (e.g. "USD")
	 * @returns {Promise<any>} A promise that resolves to the token price data
	 */
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
}
