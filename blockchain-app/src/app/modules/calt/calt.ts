import { codec, cryptography } from 'lisk-sdk';
import * as debugFactory from 'debug';
const debug = debugFactory('calt');

const registeredCALTAssetTokensSchema = {
	$id: 'calt/asset/registeredTokens',
	type: 'object',
	required: ['registeredCALTAssetTokens'],
	properties: {
		registeredCALTAssetTokens: {
			type: 'array',
			fieldNumber: 1,
			items: {
				type: 'object',
				required: ['id', 'maturityValue', 'maturityDate', 'ownerAddress', 'debtorAddress', 'name'],
				properties: {
					id: {
						dataType: 'bytes',
						fieldNumber: 1,
					},
					maturityValue: {
						dataType: 'uint64',
						fieldNumber: 2,
					},
					maturityDate: {
						dataType: 'uint32',
						fieldNumber: 3,
					},
					ownerAddress: {
						dataType: 'bytes',
						fieldNumber: 4,
					},
					debtorAddress: {
						dataType: 'bytes',
						fieldNumber: 5,
					},
					name: {
						dataType: 'string',
						fieldNumber: 6,
					},
				},
			},
		},
	},
};

const registeredCALTLiabilityTokensSchema = {
	$id: 'calt/liability/registeredTokens',
	type: 'object',
	required: ['registeredCALTLiabilityTokens'],
	properties: {
		registeredCALTLiabilityTokens: {
			type: 'array',
			fieldNumber: 1,
			items: {
				type: 'object',
				required: [
					'id',
					'maturityValue',
					'maturityDate',
					'ownerAddress',
					'creditorAddress',
					'name',
				],
				properties: {
					id: {
						dataType: 'bytes',
						fieldNumber: 1,
					},
					maturityValue: {
						dataType: 'uint64',
						fieldNumber: 2,
					},
					maturityDate: {
						dataType: 'uint32',
						fieldNumber: 3,
					},
					ownerAddress: {
						dataType: 'bytes',
						fieldNumber: 4,
					},
					creditorAddress: {
						dataType: 'bytes',
						fieldNumber: 5,
					},
					name: {
						dataType: 'string',
						fieldNumber: 6,
					},
				},
			},
		},
	},
};

const CHAIN_STATE_ASSET_TOKENS = 'calt:registeredCALTAssetTokens';
const CHAIN_STATE_LIABILITY_TOKENS = 'calt:registeredCALTLiabilityTokens';

const createCALTAssetLiabilityTokens = ({
	name,
	ownerAddress,
	nonce,
	maturityValue,
	maturityDate,
}) => {
	const nonceBuffer = Buffer.alloc(8);
	nonceBuffer.writeBigInt64LE(nonce);
	// Create a unique seed by using a combination of the owner account address and the current nonce of the account.
	const seed = Buffer.concat([ownerAddress, nonceBuffer]);
	const assetId = cryptography.hash(seed);
	const debtorAddress = ownerAddress;
	const creditorAddress = ownerAddress;

	const assetToken = {
		id: assetId,
		name,
		ownerAddress,
		maturityValue,
		maturityDate,
		debtorAddress,
	};

	const liabilityId = cryptography.hash(seed);
	const liabilityToken = {
		id: liabilityId,
		name,
		ownerAddress,
		maturityValue,
		maturityDate,
		creditorAddress,
	};

	// TODO: verify if token ids are not clashing
	const tokens = {
		assetToken,
		liabilityToken,
	};
	debug({ tokens: tokens });
	return tokens;
};

const getAllCALTAssetTokens = async dataAccess => {
	const registeredTokensBuffer = await dataAccess.getChainState(CHAIN_STATE_ASSET_TOKENS);
	if (!registeredTokensBuffer) {
		return [];
	}

	const registeredTokens = codec.decode<any>(
		registeredCALTAssetTokensSchema,
		registeredTokensBuffer,
	);
	debug(registeredTokens);
	debug('-----=======----');

	return registeredTokens.registeredCALTAssetTokens;
};

const getAllCALTAssetTokensAsJSON = async dataAccess => {
	const registeredTokensBuffer = await dataAccess.getChainState(CHAIN_STATE_ASSET_TOKENS);

	if (!registeredTokensBuffer) {
		return [];
	}

	const registeredTokens = codec.decode<any>(
		registeredCALTAssetTokensSchema,
		registeredTokensBuffer,
	);

	console.log(registeredTokens);
	console.log('-----=======----');

	debug(registeredTokens);
	debug('-----=======----');
	return codec.toJSON<any>(registeredCALTAssetTokensSchema, registeredTokens)
		.registeredCALTAssetTokens;
};

const setAllCALTAssetTokens = async (stateStore, NFTTokens) => {
	const registeredTokens = {
		registeredNFTTokens: NFTTokens.sort((a, b) => a.id.compare(b.id)),
	};

	await stateStore.chain.set(
		CHAIN_STATE_ASSET_TOKENS,
		codec.encode(registeredCALTAssetTokensSchema, registeredTokens),
	);
};

const getAllCALTLiabilityTokens = async dataAccess => {
	const registeredTokensBuffer = await dataAccess.getChainState(CHAIN_STATE_LIABILITY_TOKENS);
	if (!registeredTokensBuffer) {
		return [];
	}

	const registeredTokens = codec.decode<any>(
		registeredCALTLiabilityTokensSchema,
		registeredTokensBuffer,
	);

	return registeredTokens.registeredCALTLiabilityTokens;
};

const getAllCALTLiabilityTokensAsJSON = async dataAccess => {
	const registeredTokensBuffer = await dataAccess.getChainState(CHAIN_STATE_LIABILITY_TOKENS);

	if (!registeredTokensBuffer) {
		return [];
	}

	const registeredTokens = codec.decode<any>(
		registeredCALTLiabilityTokensSchema,
		registeredTokensBuffer,
	);

	return codec.toJSON<any>(registeredCALTLiabilityTokensSchema, registeredTokens)
		.registeredCALTLiabilityTokens;
};

const setAllCALTLiabilityTokens = async (stateStore, NFTTokens) => {
	const registeredTokens = {
		registeredNFTTokens: NFTTokens.sort((a, b) => a.id.compare(b.id)),
	};

	await stateStore.chain.set(
		CHAIN_STATE_LIABILITY_TOKENS,
		codec.encode(registeredCALTLiabilityTokensSchema, registeredTokens),
	);
};

export {
	CHAIN_STATE_ASSET_TOKENS,
	CHAIN_STATE_LIABILITY_TOKENS,
	registeredCALTAssetTokensSchema,
	registeredCALTLiabilityTokensSchema,
	getAllCALTAssetTokens,
	setAllCALTAssetTokens,
	getAllCALTAssetTokensAsJSON,
	getAllCALTLiabilityTokens,
	setAllCALTLiabilityTokens,
	getAllCALTLiabilityTokensAsJSON,
	createCALTAssetLiabilityTokens,
};
