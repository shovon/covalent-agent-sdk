import { memoizeWeakMap } from "./utils";
import { z } from "zod";

export const baseDataSchema = memoizeWeakMap(
    <T extends z.ZodTypeAny>(valueSchema: T) => {
        return z.object({
            data: valueSchema,
            error: z.boolean().optional().nullable(),
            error_message: z.string().nullable().optional(),
            error_code: z.number().nullable().optional(),
        });
    },
);

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
    explorers: z.array(
        z.object({
            label: z.string(),
            url: z.string(),
        }),
    ),
    from_address_label: z.string().nullable(),
    to_address_label: z.string().nullable(),
    gas_metadata: z.object({
        contract_decimals: z.number(),
        contract_name: z.string(),
        contract_ticker_symbol: z.string(),
        contract_address: z.string(),
        supports_erc: z.array(z.string()),
        logo_url: z.string(),
    }),
    gas_quote_rate: z.number(),
    gas_quote: z.number(),
    pretty_gas_quote: z.string(),
    value_quote: z.number(),
    pretty_value_quote: z.string(),
});

// TODO: rather than the schema repeatedly being wrapped in some {data:schema},
//   just have the schema be the schema.
export const transactionResponseSchema = z.object({
    updated_at: z.string(),
    cursor_before: z.string(),
    cursor_after: z.string(),
    quote_currency: z.string(),
    items: z.array(transactionItemSchema),
});

export const nftResponseSchema = z.object({
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
});

export const nftFloorPriceSchema = z.object({
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
});

export const transactionSummarySchema = z.object({
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
});

export const tokenApprovalSchema = z.object({
    address: z.string(),
    updated_at: z.string(),
    quote_currency: z.string(),
    chain_id: z.number(),
    chain_name: z.string(),
    items: z.array(
        z
            .object({
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
                        spender_address: z.string().nullable().optional(),
                        spender_address_label: z.string().nullable().optional(),
                        allowance: z.string().nullable().optional(),
                        allowance_quote: z.number().nullable().optional(),
                        pretty_allowance_quote: z
                            .string()
                            .nullable()
                            .optional(),
                        value_at_risk: z.string(),
                        value_at_risk_quote: z.number(),
                        pretty_value_at_risk_quote: z.string(),
                        risk_factor: z.string(),
                    }),
                ),
            })
            .nullable()
            .optional(),
    ),
});

export const nftApprovalsSchema = z.object({
    address: z.string(),
    updated_at: z.string(),
    chain_id: z.number(),
    chain_name: z.string(),
    items: z.array(
        z.object({
            contract_address: z.string(),
            contract_address_label: z.string(),
            contract_ticker_symbol: z.string(),
            supports_erc: z.array(z.string()),
            token_balances: z.array(
                z.object({
                    token_id: z.string(),
                    token_balance: z.string(),
                }),
            ),
            spenders: z.array(
                z.object({
                    block_height: z.number(),
                    tx_offset: z.number(),
                    log_offset: z.number(),
                    block_signed_at: z.string(),
                    tx_hash: z.string(),
                    spender_address: z.string().nullable(),
                    spender_address_label: z.string().nullable(),
                    allowance: z.string(),
                    token_ids_approved: z.string(),
                }),
            ),
        }),
    ),
});

export const historicalTokenBalanceSchema = z.object({
    address: z.string(),
    updated_at: z.string(),
    next_update_at: z.string(),
    quote_currency: z.string(),
    chain_id: z.number(),
    chain_name: z.string(),
    items: z.array(
        z.object({
            contract_decimals: z.number(),
            contract_name: z.string(),
            contract_ticker_symbol: z.string(),
            contract_address: z.string(),
            supports_erc: z.array(z.string()).nullable(),
            logo_url: z.string(),
            block_height: z.number(),
            last_transferred_block_height: z.number(),
            contract_display_name: z.string().nullable(),
            logo_urls: z
                .object({
                    token_logo_url: z.string(),
                    protocol_logo_url: z.string().nullable(),
                    chain_logo_url: z.string(),
                })
                .nullable(),
            last_transferred_at: z.string(),
            native_token: z.boolean(),
            type: z.string(),
            is_spam: z.boolean(),
            balance: z.string().transform(BigInt),
            quote_rate: z.number().nullable(),
            quote: z.number().nullable(),
            pretty_quote: z.string().nullable(),
            protocol_metadata: z.unknown().nullable(),
            nft_data: z.unknown().nullable(),
        }),
    ),
    pagination: z.unknown().nullable(),
});

export const quoteSchema = z.array(
    z.object({
        contract_decimals: z.number(),
        contract_name: z.string(),
        contract_ticker_symbol: z.string(),
        contract_address: z.string(),
        supports_erc: z.array(z.string()),
        logo_url: z.string(),
        update_at: z.string(),
        quote_currency: z.string(),
        logo_urls: z.object({
            token_logo_url: z.string(),
            protocol_logo_url: z.string().nullable(),
            chain_logo_url: z.string(),
        }),
        prices: z.array(
            z.object({
                contract_metadata: z
                    .object({
                        contract_decimals: z.number(),
                        contract_name: z.string(),
                        contract_ticker_symbol: z.string(),
                        contract_address: z.string(),
                        supports_erc: z.array(z.string()).nullable().optional(),
                        logo_url: z.string(),
                    })
                    .nullable(),
                date: z.string(),
                price: z.number().nullable().optional(),
                pretty_price: z.string().nullable().optional(),
            }),
        ),
        items: z.array(
            z.object({
                contract_metadata: z
                    .object({
                        contract_decimals: z.number(),
                        contract_name: z.string(),
                        contract_ticker_symbol: z.string(),
                        contract_address: z.string(),
                        supports_erc: z.array(z.string()).nullable().optional(),
                        logo_url: z.string(),
                    })
                    .nullable(),
                date: z.string(),
                price: z.number().nullable().optional(),
                pretty_price: z.string().nullable().optional(),
            }),
        ),
    }),
);

export const transactionsForWalletSchema = z.object({
    address: z.string(),
    updated_at: z.string(),
    quote_currency: z.string(),
    chain_id: z.number(),
    chain_name: z.string(),
    current_page: z.number(),
    links: z.object({
        prev: z.string(),
        next: z.string(),
    }),
    items: z.array(
        z.object({
            block_signed_at: z.string(),
            block_height: z.number(),
            block_hash: z.string(),
            tx_hash: z.string(),
            tx_offset: z.number(),
            successful: z.boolean(),
            from_address: z.string(),
            miner_address: z.string(),
            from_address_label: z.string(),
            to_address: z.string(),
            to_address_label: z.string(),
            value: z.string(),
            value_quote: z.number(),
            pretty_value_quote: z.string(),
            gas_metadata: z.object({
                contract_decimals: z.number(),
                contract_name: z.string(),
                contract_ticker_symbol: z.string(),
                contract_address: z.string(),
                supports_erc: z.array(z.string()),
                logo_url: z.string(),
            }),
            gas_offered: z.number(),
            gas_spent: z.number(),
            gas_price: z.number(),
            fees_paid: z.string(),
            gas_quote: z.number(),
            pretty_gas_quote: z.string(),
            gas_quote_rate: z.number(),
            explorers: z.array(
                z.object({
                    label: z.string(),
                    url: z.string(),
                }),
            ),
            dex_details: z.array(
                z.object({
                    log_offset: z.number(),
                    protocol_name: z.string(),
                    protocol_address: z.string(),
                    protocol_logo_url: z.string(),
                    aggregator_name: z.string(),
                    aggregator_address: z.string(),
                    version: z.number(),
                    fork_version: z.number(),
                    fork: z.string(),
                    event: z.string(),
                    pair_address: z.string(),
                    pair_lp_fee_bps: z.number(),
                    lp_token_address: z.string(),
                    lp_token_ticker: z.string(),
                    lp_token_num_decimals: z.number(),
                    lp_token_name: z.string(),
                    lp_token_value: z.string(),
                    exchange_rate_usd: z.number(),
                    token_0_address: z.string(),
                    token_0_ticker: z.string(),
                    token_0_num_decimals: z.number(),
                    token_0_name: z.string(),
                    token_1_address: z.string(),
                    token_1_ticker: z.string(),
                    token_1_num_decimals: z.number(),
                    token_1_name: z.string(),
                    token_0_amount: z.string(),
                    token_0_quote_rate: z.number(),
                    token_0_usd_quote: z.number(),
                    pretty_token_0_usd_quote: z.string(),
                    token_0_logo_url: z.string(),
                    token_1_amount: z.string(),
                    token_1_quote_rate: z.number(),
                    token_1_usd_quote: z.number(),
                    pretty_token_1_usd_quote: z.string(),
                    token_1_logo_url: z.string(),
                    sender: z.string(),
                    recipient: z.string(),
                }),
            ),
            nft_sale_details: z.array(
                z.object({
                    log_offset: z.number(),
                    topic0: z.string(),
                    protocol_contract_address: z.string(),
                    protocol_name: z.string(),
                    protocol_logo_url: z.string(),
                    to: z.string(),
                    from: z.string(),
                    maker: z.string(),
                    taker: z.string(),
                    token_id: z.string(),
                    collection_address: z.string(),
                    collection_name: z.string(),
                    token_address: z.string(),
                    token_name: z.string(),
                    ticker_symbol: z.string(),
                    num_decimals: z.number(),
                    contract_quote_rate: z.number(),
                    nft_token_price: z.number(),
                    nft_token_price_usd: z.number(),
                    pretty_nft_token_price_usd: z.string(),
                    nft_token_price_native: z.number(),
                    pretty_nft_token_price_native: z.string(),
                    token_count: z.number(),
                    num_token_ids_sold_per_sale: z.number(),
                    num_token_ids_sold_per_tx: z.number(),
                    num_collections_sold_per_sale: z.number(),
                    num_collections_sold_per_tx: z.number(),
                    trade_type: z.string(),
                    trade_group_type: z.string(),
                }),
            ),
            lending_details: z.array(
                z.object({
                    log_offset: z.number(),
                    protocol_name: z.string(),
                    protocol_address: z.string(),
                    protocol_logo_url: z.string(),
                    version: z.string(),
                    fork: z.string(),
                    fork_version: z.string(),
                    event: z.string(),
                    lp_token_name: z.string(),
                    lp_decimals: z.number(),
                    lp_ticker_symbol: z.string(),
                    lp_token_address: z.string(),
                    lp_token_amount: z.number(),
                    lp_token_price: z.number(),
                    exchange_rate: z.number(),
                    exchange_rate_usd: z.number(),
                    token_name_in: z.string(),
                    token_decimal_in: z.number(),
                    token_address_in: z.string(),
                    token_ticker_in: z.string(),
                    token_logo_in: z.string(),
                    token_amount_in: z.number(),
                    amount_in_usd: z.number(),
                    pretty_amount_in_usd: z.string(),
                    token_name_out: z.string(),
                    token_decimals_out: z.number(),
                    token_address_out: z.string(),
                    token_ticker_out: z.string(),
                    token_logo_out: z.string(),
                    token_amount_out: z.number(),
                    amount_out_usd: z.number(),
                    pretty_amount_out_usd: z.string(),
                    borrow_rate_mode: z.number(),
                    borrow_rate: z.number(),
                    on_behalf_of: z.string(),
                    liquidator: z.string(),
                    user: z.string(),
                }),
            ),
            log_events: z.array(
                z.object({
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
                }),
            ),
            safe_details: z.array(
                z.object({
                    owner_address: z.string(),
                    signature: z.string(),
                    signature_type: z.string(),
                }),
            ),
        }),
    ),
});

export const historicalPortfolioSchema = z.object({
    address: z.string(),
    updated_at: z.string(),
    quote_currency: z.string(),
    chain_id: z.number(),
    chain_name: z.string(),
    items: z.array(
        z.object({
            contract_address: z.string(),
            contract_decimals: z.number(),
            contract_name: z.string(),
            contract_ticker_symbol: z.string(),
            logo_url: z.string(),
            holdings: z.array(
                z.object({
                    quote_rate: z.number().nullable().optional(),
                    timestamp: z.string(),
                    close: z.object({
                        balance: z.string(),
                        quote: z.number(),
                        pretty_quote: z.string(),
                    }),
                    high: z.object({}),
                    low: z.object({}),
                    open: z.object({}),
                }),
            ),
        }),
    ),
});
