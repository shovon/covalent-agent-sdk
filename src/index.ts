import packageJson from "../package.json";
import {
    allchainBalancesSchema,
    baseDataSchema,
    nftFloorPriceSchema,
} from "./schema";
import { GoldRushClient } from "@covalenthq/client-sdk";

type BASE_MAINNET = "base-mainnet";

type BaseChain = BASE_MAINNET;

export type ChainName = BaseChain;

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
 * The Covalent agent
 */
export class Agent {
    private client: GoldRushClient;

    /**
     * Initializes a new instances of the Agent class.
     * @param key The GoldRush API key
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
     * The total balance of an ERC20 token that belongs to a given WalletAddress
     * @param chainName The chain to lookup
     * @param options Contains the wallet address and contract address.
     */
    async getTokenBalancesForChain(
        chainName: ChainName,
        { walletAddress }: { walletAddress: string },
    ) {
        return await this.client.BalanceService.getTokenBalancesForWalletAddress(
            chainName,
            walletAddress,
        );
    }

    /**
     * Gets the historical token balances for the supplied address.
     * @param chainName The chain that we're going to be working with
     * @param param1 A set of options that simply includes the walletAddress
     * @returns some and metadata that represents the list of historical balances
     */
    async getHistoricalTokenBalancesForAddress(
        chainName: ChainName,
        { walletAddress, date }: { walletAddress: string; date?: Date },
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
     * Retrieves the historical portfolio data for a given wallet address on a specified blockchain.
     * This includes detailed information about token holdings and their value changes over time.
     *
     * @param {ChainName} chainName - The blockchain network to query
     * @param {Object} params - The parameters for the portfolio request
     * @param {string} params.walletAddress - The wallet address to retrieve the portfolio for
     * @returns {Promise<z.infer<typeof historicalPortfolioSchema>>} A promise that resolves to the historical portfolio data.
     *   The response follows the historicalPortfolioSchema structure which includes:
     *   - Wallet address
     *   - Chain information
     *   - Quote currency
     *   - Array of token holdings with:
     *     - Contract details (address, decimals, name, symbol)
     *     - Historical holdings data (timestamps, balances, quotes)
     */

    async getHistoricalPortfolioForWalletAddress(
        chainName: ChainName,
        { walletAddress, days }: { walletAddress: string; days?: number },
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
     * Retrieves a transaction summary for a given wallet address on a specified blockchain.
     * The summary includes total transaction count, earliest transaction details, gas usage statistics,
     * and other relevant metadata.
     *
     * @param {ChainName} chainName - The name of the blockchain to query
     * @param {Object} params - The parameters for the query
     * @param {string} params.walletAddress - The wallet address to retrieve the transaction summary for
     * @returns {Promise<z.infer<typeof transactionSummarySchema>>} A promise that resolves to the transaction summary data
     */
    async getTransactionSummaryForAddress(
        chainName: ChainName,
        { walletAddress }: { walletAddress: string },
    ) {
        return this.client.TransactionService.getTransactionSummary(
            chainName,
            walletAddress,
        );
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
        return this.client.TransactionService.getAllTransactionsForAddress(
            chainName,
            walletAddress,
        );
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
    async getMultiChainTransactions(
        walletAddress: string,
        {
            before,
            after,
            limit,
        }: { before?: Date; after?: Date; limit?: number },
    ): Promise<
        ReturnType<
            typeof this.client.AllChainsService.getMultiChainAndMultiAddressTransactions
        >
    > {
        return this.client.AllChainsService.getMultiChainAndMultiAddressTransactions(
            {
                addresses: [walletAddress],
                chains: ["base-mainnet"],
                before: before?.toISOString() ?? undefined,
                after: after?.toISOString() ?? undefined,
                limit,
            },
        );
    }

    /**
     * Retrieves token balances across all supported blockchains for a given wallet address.
     *
     * @param {string} walletAddress - The wallet address to retrieve balances for
     * @returns {Promise<z.infer<typeof allchainBalancesSchema>>} A promise that resolves to the multi-chain balance data.
     *   The response follows the allchainBalancesSchema structure which includes:
     *   - Updated timestamp
     *   - Pagination cursors
     *   - Quote currency
     *   - Array of balance items with:
     *     - Contract details (name, symbol, address, decimals)
     *     - Balance information (current and 24h ago)
     *     - Quote rates and converted values
     *     - Chain metadata
     */
    async getMultichainBalances(walletAddress: string) {
        const options = {
            method: "GET",
            headers: this.headers,
        };

        baseDataSchema(allchainBalancesSchema).parse(
            await fetch(
                `https://api.covalenthq.com/v1/allchains/address/${encodeURIComponent(walletAddress)}/balances/?chains=${encodeURIComponent(["base-mainnet"].join(","))}`,
                options,
            ).then((response) => response.json()),
        );
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
        return this.client.NftService.getNftsForAddress(
            chainName,
            walletAddress,
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
     * Gets the token approvals for a given wallet address on a specific chain.
     *
     * @param {ChainName} chainName - The blockchain network to query
     * @param {Object} params - The parameters for the token approvals request
     * @param {string} params.walletAddress - The wallet address to check approvals for
     * @returns {Promise<z.infer<typeof tokenApprovalSchema>>} A promise that resolves to the token approvals data.
     *   The response follows the tokenApprovalSchema structure which includes:
     *   - Updated timestamp
     *   - Chain information
     *   - Array of approval items with:
     *     - Contract details
     *     - Approved addresses
     *     - Approval amounts
     *     - Transaction details
     */
    async getTokenApprovals(
        chainName: ChainName,
        { walletAddress }: { walletAddress: string },
    ) {
        return this.client.SecurityService.getApprovals(
            chainName,
            walletAddress,
        );
    }

    /**
     * Gets the token approvals for a given wallet address on a specific chain.
     *
     * @param {ChainName} chainName - The blockchain network to query
     * @param {Object} params - The parameters for the token approvals request
     * @param {string} params.walletAddress - The wallet address to check approvals for
     * @returns {Promise<any>} A promise that resolves to the token approvals data
     */
    async getNFTApprovals(
        chainName: ChainName,
        { walletAddress }: { walletAddress: string },
    ) {
        return this.client.SecurityService.getApprovals(
            chainName,
            walletAddress,
        );
    }

    /**
     * Gets the current price quote for a token on a specific chain.
     *
     * @param {ChainName} chainName - The blockchain network to query
     * @param {Object} params - The parameters for the quote request
     * @param {string} params.contractAddress - The contract address of the token
     * @param {Quote} params.currency - The currency to get the price quote in (e.g. "USD")
     * @returns {Promise<any>} A promise that resolves to the token price data
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
