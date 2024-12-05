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
