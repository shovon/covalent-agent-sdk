import packageJson from "../package.json";
import {
    allchainBalancesSchema,
    baseDataSchema,
    nftFloorPriceSchema,
} from "./schema";
import { GoldRushClient } from "@covalenthq/client-sdk";

type BASE_MAINNET = "base-mainnet";

type BaseChain = BASE_MAINNET;

/**
 * The name of a supported blockchain.
 */
export type ChainName = BaseChain;

/**
 * The currencies supported.
 */
export type Currency =
    | "USD"
    | "CAD"
    | "EUR"
    | "SGD"
    | "INR"
    | "JPY"
    | "VND"
    | "CNY"
    | "KRW"
    | "RUB"
    | "TRY"
    | "NGN"
    | "ARS"
    | "AUD"
    | "CHF"
    | "GBP";

const USER_AGENT_NAME = "AgentSDK";

/**
 * A powerful interface for retrieving blockchain data, designed specifically
 * for AI agents.
 *
 * The Agent class provides seamless access to on-chain data, enabling AI agents
 * to fetch real-time and historical data information tokens, NFTs, and wallet
 * activities across multiple chains. This data can be used for:
 *
 * - Portfolio analysis and tracking
 * - Market intelligence and price monitoring
 * - Wallet behavior analysis
 * - Cross-chain activity monitoring
 *
 * The data is returned in strongly-typed, structured formats that are ideal for
 * AI processing and decision making. All responses are validated against Zod
 * schemas to ensure type safety and data integrity.
 */
export class Agent {
    private client: GoldRushClient;

    /**
     * Initializes a new instances of the Agent class.
     * @param key - The GoldRush API key. If not supplied, the agent will revert
     *     back to the AGENT_SEMANTIC_SDK_API_KEY environment variable.
     */
    constructor(
        private key: string = process.env["AGENT_SEMANTIC_SDK_API_KEY"] ?? "",
    ) {
        this.client = new GoldRushClient(key, { source: USER_AGENT_NAME });
    }

    private get headers() {
        return {
            Authorization: `Bearer ${this.key}`,
            "X-Requested-With": `${USER_AGENT_NAME}/${packageJson.version}`,
        };
    }

    /**
     * Retrieves the total balance of an ERC20 token that belongs to a given wallet
     * address.
     * @param chainName - The chain to lookup
     * @param walletAddress - The requested address. Passing in an `ENS`, `RNS`,
     *     `Lens Handle`, or an `Unstoppable Domain` resolves automatically.
     * @returns A promise that contains the balances for a single wallet.
     */
    async getTokenBalancesForWalletAddress(
        chainName: ChainName,
        walletAddress: string,
    ) {
        return (
            await this.client.BalanceService.getTokenBalancesForWalletAddress(
                chainName,
                walletAddress,
            )
        ).data;
    }

    /**
     * Retrieves the historical token balances for the supplied address.
     * @param chainName - The chain that we're going to be working with
     * @param walletAddress - The requested address. Passing in an `ENS`, `RNS`,
     *     `Lens Handle`, or an `Unstoppable Domain` resolves automatically.
     * @param options - Some aditional optional parameters
     * @param options.date - Ending date to define a block range (YYYY-MM-DD).
     *     Omitting this parameter defaults to the current date.
     * @returns A promise that contains the historical balance.
     */
    async getHistoricalTokenBalancesForWalletAddress(
        chainName: ChainName,
        walletAddress: string,
        { date }: { date?: Date },
    ) {
        return (
            await this.client.BalanceService.getHistoricalTokenBalancesForWalletAddress(
                chainName,
                walletAddress,
                {
                    date: date?.toISOString() ?? undefined,
                },
            )
        ).data;
    }

    /**
     * Retrieves the historical portfolio data for a given wallet address on a
     * specified blockchain. This includes detailed information about token
     * holdings and their value changes over time.
     *
     * @param chainName - The blockchain network to query
     * @param walletAddress The requested address. Passing in an `ENS`, `RNS`,
     *     `Lens Handle`, or an `Unstoppable Domain` resolves automatically.
     * @param options - Some additional options.
     * @param options.days The number of days to return data for. Defaults to
     *     30 days.
     * @return A promise that contains the historical portfolio for wallet
     *     address
     */
    async getHistoricalPortfolioForWalletAddress(
        chainName: ChainName,
        walletAddress: string,
        { days }: { days?: number },
    ) {
        return (
            await this.client.BalanceService.getHistoricalPortfolioForWalletAddress(
                chainName,
                walletAddress,
                { days },
            )
        ).data;
    }

    /**
     * Retrieves a transaction summary for a given wallet address on a specified
     * blockchain. The summary includes total transaction count, earliest
     * transaction details, gas usage statistics, and other relevant metadata.
     *
     * @param chainName - The name of the blockchain to query
     * @param walletAddress - The requested address. Passing in an `ENS`, `RNS`,
     *     `Lens Handle`, or an `Unstoppable Domain` resolves automatically.
     * @returns A promise that contains the transaction summary data
     */
    async getTransactionSummaryForAddress(
        chainName: ChainName,
        walletAddress: string,
    ) {
        return (
            await this.client.TransactionService.getTransactionSummary(
                chainName,
                walletAddress,
            )
        ).data;
    }

    /**
     * Retrieves the transaction history for a given wallet address on a specified blockchain.
     *
     * @param chainName - The name of the blockchain to query.
     * @param walletAddress The requested address. Passing in an `ENS`, `RNS`,
     *     `Lens Handle`, or an `Unstoppable Domain` resolves automatically.
     * @returns An async iterable that provide transactions for a single
     *     address.
     */
    async *getAllTransactionsForAddress(
        chainName: ChainName,
        walletAddress: string,
    ) {
        const it =
            await this.client.TransactionService.getAllTransactionsForAddress(
                chainName,
                walletAddress,
            );

        for await (const el of it) {
            yield el;
        }
    }

    /**
     * Retrieves transaction history across all supported blockchains for a
     * given wallet address.
     *
     * @param walletAddress - The requested addresses. Passing in an `ENS`,
     *     `RNS`, `Lens Handle`, or an `Unstoppable Domain` resolves automatically.
     * @param options - some additional options
     * @param options.before - Pagination cursor pointing to fetch transactions
     *     before a certain point.
     * @param options.after - Pagination cursor pointing to fetch transaction
     *     after a certain point.
     * @param options.limit - Number of transactions to return per page, up to
     *     the default max of 100 items.
     * @returns A promise that contains a list of multi-chain transacitons.
     */
    async getMultiChainAndMultiAddressTransactions(
        walletAddresses: string[],
        {
            before,
            after,
            limit,
        }: { before?: Date; after?: Date; limit?: number },
    ): Promise<
        Awaited<
            ReturnType<
                typeof this.client.AllChainsService.getMultiChainAndMultiAddressTransactions
            >
        >["data"]
    > {
        return (
            await this.client.AllChainsService.getMultiChainAndMultiAddressTransactions(
                {
                    addresses: walletAddresses,
                    chains: ["base-mainnet"],
                    before: before?.toISOString() ?? undefined,
                    after: after?.toISOString() ?? undefined,
                    limit,
                },
            )
        ).data;
    }

    /**
     * Retrieves token balances across all supported blockchains for a given wallet address.
     *
     * @param walletAddress - The requested address. Passing in an `ENS`, `RNS`,
     *     `Lens Handle`, or an `Unstoppable Domain` resolves automatically.
     * @returns A promise that contains the multichain balances of a single
     *     wallet address.
     */
    async getMultichainBalances(walletAddress: string) {
        const options = {
            method: "GET",
            headers: this.headers,
        };

        return baseDataSchema(allchainBalancesSchema).parse(
            await fetch(
                `https://api.covalenthq.com/v1/allchains/address/${encodeURIComponent(walletAddress)}/balances/?chains=${encodeURIComponent(["base-mainnet"].join(","))}`,
                options,
            ).then((response) => response.json()),
        ).data;
    }

    /**
     * Retrieves all NFTs that a wallet owns.
     *
     * @param chainName - The blockchain network to query
     * @param walletAddress - The requested address. Passing in an `ENS`, `RNS`,
     *     `Lens Handle`, or an `Unstoppable Domain` resolves automatically.
     * @returns A promise that contains a list of NFTs that a wallet owns.
     */
    async getNftsForAddress(chainName: ChainName, walletAddress: string) {
        return (
            await this.client.NftService.getNftsForAddress(
                chainName,
                walletAddress,
            )
        ).data;
    }

    /**
     * Retrieves the floor price history for an NFT collection on a specific
     * blockchain.
     *
     * @param chainName - The blockchain network to query
     * @param contractAddress - The requested contract address. Passing in an
     *     `ENS`, `RNS`, `Lens Handle`, or an `Unstoppable Domain` resolves
     *     automatically.
     * @returns A promise that contains the floor price of a given NFT
     *     collection
     */
    async getNFTFloorPrice(chainName: ChainName, contractAddress: string) {
        const options = {
            method: "GET",
            headers: this.headers,
        };

        return baseDataSchema(nftFloorPriceSchema).parse(
            await fetch(
                `https://api.covalenthq.com/v1/${chainName}/nft_market/${contractAddress}/floor_price/`,
                options,
            ).then((response) => response.json()),
        ).data;
    }

    /**
     * Retrieves the token approvals for a given wallet address on a specific chain.
     *
     * @param chainName - The blockchain network to query
     * @param walletAddress - The requested address. Passing in an `ENS`, `RNS`,
     *     `Lens Handle`, or an `Unstoppable Domain` resolves automatically.
     * @returns A promise that contains a list of all token approvals on a
     *     chain, for a given wallet
     */
    async getTokenApprovals(chainName: ChainName, walletAddress: string) {
        return (
            await this.client.SecurityService.getApprovals(
                chainName,
                walletAddress,
            )
        ).data;
    }

    /**
     * Retrieves the token approvals for a given wallet address on a specific chain.
     *
     * @param chainName - The blockchain network to query
     * @param walletAddress - The requested address. Passing in an `ENS`, `RNS`,
     *     `Lens Handle`, or an `Unstoppable Domain` resolves automatically.
     * @returns A promise that resolves to the token approvals data
     */
    async getNFTApprovals(chainName: ChainName, walletAddress: string) {
        return (
            await this.client.SecurityService.getApprovals(
                chainName,
                walletAddress,
            )
        ).data;
    }

    /**
     * Retrieves the current price quote for an ERC20 token on a specific chain.
     *
     * @param chainName - The blockchain network to query
     * @param options - The parameters for the quote request
     * @param options.contractAddress - The contract address of the
     *     token
     * @param options.currency - The currency to get the price quote in
     *     (e.g. "USD")
     * @param options.from - The start time for the quote range
     * @param options.to - The end time for the quote range
     * @returns A promise that resolves to the token price data
     */
    async getQuote(
        chainName: ChainName,
        {
            contractAddress,
            currency,
            from,
            to,
        }: {
            contractAddress: string;
            currency: Currency;
            from?: Date;
            to?: Date;
        },
    ) {
        const options: Record<string, string> = {};
        if (from) options["from"] = from.toISOString();
        if (to) options["to"] = to.toISOString();

        return (
            await this.client.PricingService.getTokenPrices(
                chainName,
                currency,
                contractAddress,
                options,
            )
        ).data;
    }
}
