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
