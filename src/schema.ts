import { z } from "zod";

const explorerSchema = z.object({
	label: z.string(),
	url: z.string(),
});

const gasMetadataSchema = z.object({
	contract_decimals: z.number(),
	contract_name: z.string(),
	contract_ticker_symbol: z.string(),
	contract_address: z.string(),
	supports_erc: z.array(z.string()),
	logo_url: z.string(),
});

const transactionItemSchema = z.object({
	block_height: z.number(),
	block_signed_at: z.string(),
	block_hash: z.string(),
	tx_hash: z.string(),
	tx_offset: z.number(),
	miner_address: z.string(),
	from_address: z.string(),
	to_address: z.string(),
	value: z.string(),
	gas_offered: z.number(),
	gas_spent: z.number(),
	gas_price: z.number(),
	fees_paid: z.number(),
	successful: z.boolean(),
	chain_id: z.string(),
	chain_name: z.string(),
	explorers: z.array(explorerSchema),
	from_address_label: z.string().nullable(),
	to_address_label: z.string().nullable(),
	gas_metadata: gasMetadataSchema,
	gas_quote_rate: z.number(),
	gas_quote: z.number(),
	pretty_gas_quote: z.string(),
	value_quote: z.number(),
	pretty_value_quote: z.string(),
});

export const transactionResponseSchema = z.object({
	data: z.object({
		updated_at: z.string(),
		cursor_before: z.string(),
		cursor_after: z.string(),
		quote_currency: z.string(),
		items: z.array(transactionItemSchema),
	}),
	error: z.boolean(),
	error_message: z.string().nullable(),
	error_code: z.number().nullable(),
});

export const nftResponseSchema = z.object({
	data: z.object({
		updated_at: z.string(),
		items: z.array(
			z.object({
				contract_name: z.string(),
				contract_ticker_symbol: z.string(),
				contract_address: z.string(),
				supports_erc: z.array(z.string()),
				is_spam: z.boolean(),
				balance: z.string(),
				balance_24h: z.string(),
				type: z.string(),
				floor_price_quote: z.number().nullable(),
				pretty_floor_price_quote: z.string().nullable(),
				floor_price_native_quote: z.number().nullable(),
				nft_data: z
					.array(
						z.object({
							token_id: z.string(),
							token_balance: z.string(),
							token_url: z.string().nullable(),
							original_owner: z.string().nullable(),
							current_owner: z.string().nullable(),
							external_data: z.unknown(),
							asset_cached: z.boolean(),
							image_cached: z.boolean(),
						}),
					)
					.nullable(),
				last_transfered_at: z.string(),
			}),
		),
		address: z.string(),
	}),
	error: z.boolean(),
	error_message: z.string().nullable(),
	error_code: z.number().nullable(),
});

export const nftFloorPriceSchema = z.object({
	data: z.object({
		address: z.string(),
		updated_at: z.string(),
		quote_currency: z.string(),
		chain_id: z.number(),
		chain_name: z.string(),
		items: z.array(
			z.object({
				date: z.string(),
				native_ticker_symbol: z.string(),
				native_name: z.string(),
				floor_price_native_quote: z.number(),
				floor_price_quote: z.number(),
				pretty_floor_price_quote: z.string(),
			}),
		),
	}),
	error: z.boolean(),
	error_message: z.string().nullable(),
	error_code: z.number().nullable(),
});

export const transactionSummarySchema = z.object({
	data: z.object({
		updated_at: z.string(),
		address: z.string(),
		chain_id: z.number(),
		chain_name: z.string(),
		items: z
			.array(
				z.object({
					total_count: z.number(),
					earliest_transaction: z
						.object({
							block_signed_at: z.string(),
							tx_hash: z.string(),
							tx_detail_link: z.string(),
						})
						.nullable(),
					latest_transaction: z.object({}).nullable(),
					gas_summary: z
						.object({
							total_sent_count: z.number(),
							total_fees_paid: z.string(),
							total_gas_quote: z.number(),
							pretty_total_gas_quote: z.string(),
							average_gas_quote_per_tx: z.number(),
							pretty_average_gas_quote_per_tx: z.string(),
							gas_metadata: z.object({
								contract_decimals: z.number(),
								contract_name: z.string(),
								contract_ticker_symbol: z.string(),
								contract_address: z.string(),
								supports_erc: z.array(z.string()),
								logo_url: z.string(),
							}),
						})
						.optional()
						.nullable(),
				}),
			)
			.nullable(),
	}),
});

export const tokenApprovalSchema = z.object({
	data: z.object({
		address: z.string(),
		updated_at: z.string(),
		quote_currency: z.string(),
		chain_id: z.number(),
		chain_name: z.string(),
		items: z.array(
			z.object({
				token_address: z.string(),
				token_address_label: z.string(),
				ticker_symbol: z.string(),
				contract_decimals: z.number(),
				logo_url: z.string(),
				quote_rate: z.number(),
				balance: z.string(),
				balance_quote: z.number(),
				pretty_balance_quote: z.string(),
				value_at_risk: z.string(),
				value_at_risk_quote: z.number(),
				pretty_value_at_risk_quote: z.string(),
				spenders: z.array(
					z.object({
						block_height: z.number(),
						tx_offset: z.number(),
						log_offset: z.number(),
						block_signed_at: z.string(),
						tx_hash: z.string(),
						spender_address: z.string(),
						spender_address_label: z.string(),
						allowance: z.string(),
						allowance_quote: z.number(),
						pretty_allowance_quote: z.string(),
						value_at_risk: z.string(),
						value_at_risk_quote: z.number(),
						pretty_value_at_risk_quote: z.string(),
						risk_factor: z.string(),
					}),
				),
			}),
		),
	}),
});
