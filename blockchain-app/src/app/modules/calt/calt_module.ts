/*
 * LiskHQ/lisk-commander
 * Copyright © 2021 Lisk Foundation
 *
 * See the LICENSE file at the top-level directory of this distribution
 * for licensing information.
 *
 * Unless otherwise agreed in a custom licensing agreement with the Lisk Foundation,
 * no part of this software, including this file, may be copied, modified,
 * propagated, or distributed except according to the terms contained in the
 * LICENSE file.
 *
 * Removal or modification of this copyright notice is prohibited.
 *
 */

/* eslint-disable class-methods-use-this */

import { TokenAccount } from 'lisk-framework/dist-node/modules/token/types';
import {
	AfterBlockApplyContext,
	AfterGenesisBlockApplyContext,
	BaseModule,
	BeforeBlockApplyContext,
	StateStore,
	TransactionApplyContext,
} from 'lisk-sdk';
import * as debugFactory from 'debug';
import { BuybackDebtAsset } from './assets/buyback_debt_asset';
import { BuyDebtAsset } from './assets/buy_debt_asset';
import { CreateDebtAsset } from './assets/create_debt_asset';
import { LiquidateDebtAsset } from './assets/liquidate_debt_asset';
import {
	getAllCALTAssetTokensAsJSON,
	getAllCALTLiabilityTokensAsJSON,
	getAllCALTAssetTokens,
	getAllCALTLiabilityTokens,
} from './calt';
const debug = debugFactory('calt-module');

export class CaltModule extends BaseModule {
	public actions = {
		// Example below
		// getBalance: async (params) => this._dataAccess.account.get(params.address).token.balance,
		// getBlockByID: async (params) => this._dataAccess.blocks.get(params.id),
		getAllCALTAssetTokens: async params => {
			const jsonTokens = await getAllCALTAssetTokensAsJSON(this._dataAccess);
			console.log(jsonTokens);
			debug('pppppppp');
			const tokens = await getAllCALTAssetTokens(this._dataAccess);
			debug(tokens);
			return jsonTokens;
		},
		getAllCALTLiabilityTokens: async params => {
			const jsonTokens = await getAllCALTLiabilityTokensAsJSON(this._dataAccess);
			console.log(jsonTokens);
			const tokens = await getAllCALTLiabilityTokens(this._dataAccess);
			console.log(tokens);
			return tokens;
		},
	};
	public reducers = {
		// Example below
		// getBalance: async (
		// 	params: Record<string, unknown>,
		// 	stateStore: StateStore,
		// ): Promise<bigint> => {
		// 	const { address } = params;
		// 	if (!Buffer.isBuffer(address)) {
		// 		throw new Error('Address must be a buffer');
		// 	}
		// 	const account = await stateStore.account.getOrDefault<TokenAccount>(address);
		// 	return account.token.balance;
		// },
	};
	public name = 'calt';
	public transactionAssets = [
		new CreateDebtAsset(),
		new BuyDebtAsset(),
		new LiquidateDebtAsset(),
		new BuybackDebtAsset(),
	];
	public events = [
		// Example below
		// 'calt:newBlock',
	];
	public id = 4000;

	accountSchema = {
		type: 'object',
		required: ['ownAssets', 'ownLiabilities'],
		properties: {
			ownAssets: {
				type: 'array',
				fieldNumber: 4,
				items: {
					dataType: 'bytes',
				},
			},
			ownLiabilities: {
				type: 'array',
				fieldNumber: 5,
				items: {
					dataType: 'bytes',
				},
			},
		},
		default: {
			ownAssets: [],
			ownLiabilities: [],
		},
	};

	// public constructor(genesisConfig: GenesisConfig) {
	//     super(genesisConfig);
	// }

	// Lifecycle hooks
	public async beforeBlockApply(_input: BeforeBlockApplyContext) {
		// Get any data from stateStore using block info, below is an example getting a generator
		// const generatorAddress = getAddressFromPublicKey(_input.block.header.generatorPublicKey);
		// const generator = await _input.stateStore.account.get<TokenAccount>(generatorAddress);
	}

	public async afterBlockApply(_input: AfterBlockApplyContext) {
		// Get any data from stateStore using block info, below is an example getting a generator
		// const generatorAddress = getAddressFromPublicKey(_input.block.header.generatorPublicKey);
		// const generator = await _input.stateStore.account.get<TokenAccount>(generatorAddress);
	}

	public async beforeTransactionApply(_input: TransactionApplyContext) {
		// Get any data from stateStore using transaction info, below is an example
		// const sender = await _input.stateStore.account.getOrDefault<TokenAccount>(_input.transaction.senderAddress);
	}

	public async afterTransactionApply(_input: TransactionApplyContext) {
		// Get any data from stateStore using transaction info, below is an example
		// const sender = await _input.stateStore.account.getOrDefault<TokenAccount>(_input.transaction.senderAddress);
	}

	public async afterGenesisBlockApply(_input: AfterGenesisBlockApplyContext) {
		// Get any data from genesis block, for example get all genesis accounts
		// const genesisAccoounts = genesisBlock.header.asset.accounts;
	}
}
