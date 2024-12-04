# Class: Agent

The Covalent agent

## Constructors

### new Agent()

> **new Agent**(`key`): [`Agent`](Agent.md)

Initializes a new instances of the Agent class.

#### Parameters

##### key

`string`

The GoldRush API key

#### Returns

[`Agent`](Agent.md)

#### Defined in

[src/main.ts:20](https://github.com/shovon/covalent-agent-sdk/blob/8d1ef3baca97c8c4f586cabbe4cf90e92e11a87a/src/main.ts#L20)

## Methods

### getHistoricalTokenBalancesForAddress()

> **getHistoricalTokenBalancesForAddress**(`chainName`, `param1`): `Promise`\<`null` \| `Nullable`\<`object`\>\>

Gets the historical token balances for the supplied address.

#### Parameters

##### chainName

[`ChainName`](../enumerations/ChainName.md)

The chain that we're going to be working with

##### param1

A set of options that simply includes the walletAddress

###### walletAddress

`string`

#### Returns

`Promise`\<`null` \| `Nullable`\<`object`\>\>

some and metadata that represents the list of historical balances

#### Defined in

[src/main.ts:55](https://github.com/shovon/covalent-agent-sdk/blob/8d1ef3baca97c8c4f586cabbe4cf90e92e11a87a/src/main.ts#L55)

***

### getQuote()

> **getQuote**(`chainNane`, `params`): `Promise`\<`null` \| `Nullable`\<`object`\>[]\>

Gets the current price quote for a token on a specific chain.

#### Parameters

##### chainNane

[`ChainName`](../enumerations/ChainName.md)

The blockchain network to query

##### params

The parameters for the quote request

###### contractAddress

`string`

The contract address of the token

###### currency

`Quote`

The currency to get the price quote in (e.g. "USD")

#### Returns

`Promise`\<`null` \| `Nullable`\<`object`\>[]\>

A promise that resolves to the token price data

#### Defined in

[src/main.ts:176](https://github.com/shovon/covalent-agent-sdk/blob/8d1ef3baca97c8c4f586cabbe4cf90e92e11a87a/src/main.ts#L176)

***

### getTokenBalancesForChain()

> **getTokenBalancesForChain**(`chainName`, `options`): `Promise`\<`bigint`\>

The total balance of an ERC20 token that belongs to a given WalletAddress

#### Parameters

##### chainName

[`ChainName`](../enumerations/ChainName.md)

The chain to lookup

##### options

Contains the wallet address and contract address.

###### contractAddress

`string`

###### walletAddress

`string`

#### Returns

`Promise`\<`bigint`\>

#### Defined in

[src/main.ts:29](https://github.com/shovon/covalent-agent-sdk/blob/8d1ef3baca97c8c4f586cabbe4cf90e92e11a87a/src/main.ts#L29)

***

### getTokenHoldings()

> **getTokenHoldings**(`chainName`, `options`): `Promise`\<`Nullable`\<`object`\> & `object`[]\>

Gets the token holdings for a given wallet addres on a chain.

#### Parameters

##### chainName

[`ChainName`](../enumerations/ChainName.md)

The chain to lookup

##### options

Contains the wallet address and the currency to work with

###### currency

`Quote`

###### date

`null` \| `string`

###### walletAddress

`string`

#### Returns

`Promise`\<`Nullable`\<`object`\> & `object`[]\>

#### Defined in

[src/main.ts:72](https://github.com/shovon/covalent-agent-sdk/blob/8d1ef3baca97c8c4f586cabbe4cf90e92e11a87a/src/main.ts#L72)

***

### portfolioGrowth()

> **portfolioGrowth**(): `void`

#### Returns

`void`

#### Defined in

[src/main.ts:190](https://github.com/shovon/covalent-agent-sdk/blob/8d1ef3baca97c8c4f586cabbe4cf90e92e11a87a/src/main.ts#L190)

***

### transactionHistory()

> **transactionHistory**(`chainName`, `params`): `Promise`\<`AsyncIterable`\<`GoldRushResponse`\<`Nullable`\<`object`\>\>, `any`, `any`\>\>

Retrieves the transaction history for a given wallet address on a specified blockchain.

#### Parameters

##### chainName

[`ChainName`](../enumerations/ChainName.md)

The name of the blockchain to query.

##### params

The parameters for the query.

###### walletAddress

`string`

The wallet address to retrieve the transaction history for.

#### Returns

`Promise`\<`AsyncIterable`\<`GoldRushResponse`\<`Nullable`\<`object`\>\>, `any`, `any`\>\>

A promise that resolves to the transaction history.

#### Defined in

[src/main.ts:154](https://github.com/shovon/covalent-agent-sdk/blob/8d1ef3baca97c8c4f586cabbe4cf90e92e11a87a/src/main.ts#L154)
