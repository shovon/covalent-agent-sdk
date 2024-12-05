import {
	GoldRushClient,
	ChainName,
	ChainID,
	Quote,
} from "@covalenthq/client-sdk";

export { ChainName } from "@covalenthq/client-sdk";

import { z } from "zod";
import { transactionResponseSchema } from "./schema";

type AllChainsResponse = z.infer<typeof allChainsResponseSchema>;

const allChainsResponseGasMetadata = z.object({
	contract_decimals: z.number(),
	contract_name: z.string(),
	contract_ticker_symbol: z.string(),
	contract_address: z.string(),
	supports_erc: z.array(z.string()),
	logo_url: z.string(),
});

const explorerSchema = z.object({
	label: z.string(),
	url: z.string(),
});

const logEventSchema = z.object({
	block_signed_at: z.string(),
	block_height: z.number(),
	tx_offset: z.number(),
	log_offset: z.number(),
	tx_hash: z.string(),
	raw_log_topics: z.array(z.string()),
	sender_contract_decimals: z.number(),
	sender_name: z.string(),
	sender_contract_ticker_symbol: z.string(),
	sender_address: z.string(),
	sender_address_label: z.string(),
	sender_logo_url: z.string(),
	supports_erc: z.array(z.string()),
	sender_factory_address: z.string(),
	raw_log_data: z.string(),
	decoded: z.object({
		name: z.string(),
		signature: z.string(),
		params: z.array(
			z.object({
				name: z.string(),
				type: z.string(),
				indexed: z.boolean(),
				decoded: z.boolean(),
				value: z.string(),
			}),
		),
	}),
});

const transferSchema = z.array(
	z.object({
		from_address: z.string(),
		to_address: z.string(),
		value: z.string(),
		gas_limit: z.number(),
	}),
);

const stateChangeSchema = z.object({
	address: z.string(),
	balance_before: z.string(),
	balance_after: z.string(),
	storage_changes: z.array(
		z.object({
			storage_address: z.string(),
			value_before: z.string(),
			value_after: z.string(),
		}),
	),
	nonce_before: z.number(),
	nonce_after: z.number(),
});

const allChainsResponseItemSchema = z.object({
	block_height: z.number(),
	block_signed_at: z.string(),
	block_hash: z.string(),
	tx_hash: z.string(),
	tx_offset: z.number(),
	miner_address: z.string(),
	from_address: z.string(),
	from_address_label: z.string(),
	to_address: z.string(),
	to_address_label: z.string(),
	value: z.string(),
	value_quote: z.number(),
	pretty_value_quote: z.string(),
	gas_offered: z.number(),
	gas_spent: z.number(),
	gas_price: z.number(),
	gas_quote: z.number(),
	pretty_gas_quote: z.string(),
	gas_quote_rate: z.number(),
	fees_paid: z.string(),
	gas_metadata: allChainsResponseGasMetadata,
	successful: z.boolean(),
	chain_id: z.string(),
	chain_name: z.string(),
	explorers: z.array(explorerSchema),
	log_events: z.array(logEventSchema),
	internal_transfers: transferSchema,
	state_changes: z.array(stateChangeSchema),
	input_data: z.object({
		method_id: z.string(),
	}),
});

const allChainsResponseSchema = z.object({
	updated_at: z.string(),
	cursor_before: z.string(),
	cursor_after: z.string(),
	quote_currency: z.string(),
	items: z.array(allChainsResponseItemSchema),
});

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

	async getAllChainsTransactions(walletAddress: string) {
		const options = {
			method: "GET",
			headers: {
				Authorization: `Bearer ${this.key}`,
			},
		};

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
