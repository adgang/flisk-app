const fs_extra = require('fs-extra');
const os = require('os');
const path = require('path');
const { cryptography, codec, db } = require('lisk-sdk');

const DB_KEY_TRANSACTIONS = 'calt:transactions';
const CREATECALT_DEBT_ASSET_ID = 4;
const PURCHASECALT_DEBT_ASSET_ID = 5;

// Schemas
const encodedTransactionSchema = {
	$id: 'calt/encoded/transactions',
	type: 'object',
	required: ['transactions'],
	properties: {
		transactions: {
			type: 'array',
			fieldNumber: 1,
			items: {
				dataType: 'bytes',
			},
		},
	},
};

const encodedCALTHistorySchema = {
	$id: 'calt/encoded/caltHistory',
	type: 'object',
	required: ['caltHistory'],
	properties: {
		caltHistory: {
			type: 'array',
			fieldNumber: 1,
			items: {
				dataType: 'bytes',
			},
		},
	},
};

const getDBInstance = async (
	dataPath = '~/.lisk/flisk-blockchain-app/',
	dbName = 'calt_plugin.db',
) => {
	const dirPath = path.join(dataPath.replace('~', os.homedir()), 'plugins/data', dbName);
	await fs_extra.ensureDir(dirPath);
	return new db.KVStore(dirPath);
};

const saveTransactions = async (db, payload) => {
	const savedTransactions = await getTransactions(db);
	const transactions = [...savedTransactions, ...payload];
	const encodedTransactions = codec.encode(encodedTransactionSchema, { transactions });
	await db.put(DB_KEY_TRANSACTIONS, encodedTransactions);
};

const getTransactions = async db => {
	try {
		const encodedTransactions = await db.get(DB_KEY_TRANSACTIONS);
		const { transactions } = codec.decode(encodedTransactionSchema, encodedTransactions);
		return transactions;
	} catch (error) {
		return [];
	}
};

const getAllTransactions = async (db, registeredSchema) => {
	const savedTransactions = await getTransactions(db);
	const transactions: any[] = [];
	for (const trx of savedTransactions) {
		transactions.push(decodeTransaction(trx, registeredSchema));
	}
	return transactions;
};

const getCALTHistory = async (db, dbKey) => {
	try {
		const encodedCALTHistory = await db.get(dbKey);
		const { caltHistory } = codec.decode(encodedCALTHistorySchema, encodedCALTHistory);

		return caltHistory;
	} catch (error) {
		return [];
	}
};

const saveTransactionsAtCreation = async (channel, trx, tag) => {
	let dbKey, savedHistory, base32Address, caltHistory, encodedCALTHistory;

	// TODO: check if await is necessary here
	channel.invoke(tag).then(async val => {
		for (let i = 0; i < val.length; i++) {
			const senderAdress = cryptography.getAddressFromPublicKey(
				Buffer.from(trx.senderPublicKey, 'hex'),
			);
			if (val[i].ownerAddress === senderAdress.toString('hex')) {
				dbKey = `calt:${val[i].id}`;
				savedHistory = await getCALTHistory(db, dbKey);
				if (savedHistory && savedHistory.length < 1) {
					base32Address = cryptography.getBase32AddressFromPublicKey(
						Buffer.from(trx.senderPublicKey, 'hex'),
						'lsk',
					);
					caltHistory = [Buffer.from(base32Address, 'binary'), ...savedHistory];
					encodedCALTHistory = codec.encode(encodedCALTHistorySchema, { caltHistory });
					await db.put(dbKey, encodedCALTHistory);
				}
			}
		}
	});
};

const saveCALTHistory = async (db, decodedBlock, registeredModules, channel) => {
	decodedBlock.payload.map(async trx => {
		const module = registeredModules.find(m => m.id === trx.moduleID);
		if (module.name === 'calt') {
			let dbKey, savedHistory, base32Address, caltHistory, encodedCALTHistory;
			if (trx.assetID === CREATECALT_DEBT_ASSET_ID) {
				await saveTransactionsAtCreation(channel, trx, 'calt:getAllCALTAssetTokens');
				await saveTransactionsAtCreation(channel, trx, 'calt:getAllCALTLiabilityTokens');
			} else {
				dbKey = `calt:${trx.asset.debtAssetId}`;
				base32Address =
					trx.assetID === PURCHASECALT_DEBT_ASSET_ID
						? cryptography.getBase32AddressFromAddress(Buffer.from(trx.asset.recipient, 'hex'))
						: cryptography.getBase32AddressFromPublicKey(
								Buffer.from(trx.senderPublicKey, 'hex'),
								'lsk',
						  );
				savedHistory = await getCALTHistory(db, dbKey);
				caltHistory = [Buffer.from(base32Address, 'binary'), ...savedHistory];
				encodedCALTHistory = codec.encode(encodedCALTHistorySchema, { caltHistory });
				await db.put(dbKey, encodedCALTHistory);
			}
		}
	});
};

const decodeTransaction = (encodedTransaction: any, registeredSchema: { transaction: any }) => {
	const transaction = codec.decode(registeredSchema.transaction, encodedTransaction);
	const assetSchema = getTransactionAssetSchema(transaction, registeredSchema);
	const asset = codec.decode(assetSchema, transaction.asset);
	const id = cryptography.hash(encodedTransaction);
	return {
		...codec.toJSON(registeredSchema.transaction, transaction),
		asset: codec.toJSON(assetSchema, asset),
		id: id.toString('hex'),
	};
};

const getTransactionAssetSchema = (transaction, registeredSchema) => {
	const txAssetSchema = registeredSchema.transactionsAssets.find(
		assetSchema =>
			assetSchema.moduleID === transaction.moduleID && assetSchema.assetID === transaction.assetID,
	);
	if (!txAssetSchema) {
		throw new Error(
			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			`ModuleID: ${transaction.moduleID} AssetID: ${transaction.assetID} is not registered.`,
		);
	}
	return txAssetSchema.schema;
};

export {
	getDBInstance,
	getAllTransactions,
	getTransactions,
	saveTransactions,
	saveCALTHistory,
	getCALTHistory,
};
