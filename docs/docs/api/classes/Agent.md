# Class: Agent

The Covalent agent

## Constructors

### new Agent()

> **new Agent**(`key`): [`Agent`](Agent.md)

#### Parameters

##### key

`string`

#### Returns

[`Agent`](Agent.md)

#### Defined in

[src/main.ts:16](https://github.com/shovon/covalent-agent-sdk/blob/6137d483f2521e0042c2072a8e43f33ece28b71e/src/main.ts#L16)

## Methods

### getHistoricalTokenBalancesForAddress()

> **getHistoricalTokenBalancesForAddress**(`chainName`, `__namedParameters`): `Promise`\<`null` \| `Nullable`\<`object`\>\>

#### Parameters

##### chainName

[`ChainName`](../enumerations/ChainName.md)

##### \_\_namedParameters

###### walletAddress

`string`

#### Returns

`Promise`\<`null` \| `Nullable`\<`object`\>\>

#### Defined in

[src/main.ts:45](https://github.com/shovon/covalent-agent-sdk/blob/6137d483f2521e0042c2072a8e43f33ece28b71e/src/main.ts#L45)

***

### getQuote()

> **getQuote**(`chainNane`, `__namedParameters`): `Promise`\<`null` \| `Nullable`\<`object`\>[]\>

#### Parameters

##### chainNane

[`ChainName`](../enumerations/ChainName.md)

##### \_\_namedParameters

###### contractAddress

`string`

###### currency

`Quote`

#### Returns

`Promise`\<`null` \| `Nullable`\<`object`\>[]\>

#### Defined in

[src/main.ts:125](https://github.com/shovon/covalent-agent-sdk/blob/6137d483f2521e0042c2072a8e43f33ece28b71e/src/main.ts#L125)

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

[src/main.ts:25](https://github.com/shovon/covalent-agent-sdk/blob/6137d483f2521e0042c2072a8e43f33ece28b71e/src/main.ts#L25)

***

### getTokenHoldings()

> **getTokenHoldings**(`chainName`, `options`): `Promise`\<`void`\>

#### Parameters

##### chainName

[`ChainName`](../enumerations/ChainName.md)

The chain to lookup

##### options

Contains the wallet address

###### currency

`Quote`

###### walletAddress

`string`

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/main.ts:62](https://github.com/shovon/covalent-agent-sdk/blob/6137d483f2521e0042c2072a8e43f33ece28b71e/src/main.ts#L62)

***

### lpPools()

> **lpPools**(): `void`

#### Returns

`void`

#### Defined in

[src/main.ts:149](https://github.com/shovon/covalent-agent-sdk/blob/6137d483f2521e0042c2072a8e43f33ece28b71e/src/main.ts#L149)

***

### portfolioGrowth()

> **portfolioGrowth**(): `void`

#### Returns

`void`

#### Defined in

[src/main.ts:139](https://github.com/shovon/covalent-agent-sdk/blob/6137d483f2521e0042c2072a8e43f33ece28b71e/src/main.ts#L139)

***

### portfolioView()

> **portfolioView**(): `void`

#### Returns

`void`

#### Defined in

[src/main.ts:145](https://github.com/shovon/covalent-agent-sdk/blob/6137d483f2521e0042c2072a8e43f33ece28b71e/src/main.ts#L145)

***

### transactionHistory()

> **transactionHistory**(`chainName`, `__namedParameters`): `Promise`\<`AsyncIterable`\<`GoldRushResponse`\<`Nullable`\<`object`\>\>, `any`, `any`\>\>

#### Parameters

##### chainName

[`ChainName`](../enumerations/ChainName.md)

##### \_\_namedParameters

###### walletAddress

`string`

#### Returns

`Promise`\<`AsyncIterable`\<`GoldRushResponse`\<`Nullable`\<`object`\>\>, `any`, `any`\>\>

#### Defined in

[src/main.ts:112](https://github.com/shovon/covalent-agent-sdk/blob/6137d483f2521e0042c2072a8e43f33ece28b71e/src/main.ts#L112)

***

### trends()

> **trends**(): `void`

#### Returns

`void`

#### Defined in

[src/main.ts:141](https://github.com/shovon/covalent-agent-sdk/blob/6137d483f2521e0042c2072a8e43f33ece28b71e/src/main.ts#L141)
