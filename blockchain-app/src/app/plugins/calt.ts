import { BaseChannel, BasePlugin, codec } from 'lisk-sdk';
import express from 'express';
import cors from 'cors';
import {
	getDBInstance,
	getAllTransactions,
	getTransactions,
	saveTransactions,
	saveCALTHistory,
	getCALTHistory,
} from './calt-db';

// import * as pJSON from '../../../package.json';
const pJSON = {
	author: 'Aditya',
	version: '0.1.0',
	name: 'flisk',
};

export class CALTAPIPlugin extends BasePlugin {
	_server: any = undefined;
	_app: any = undefined;
	_channel: any = undefined;
	_db: any = undefined;
	_nodeInfo: any = undefined;

	static get alias() {
		return 'CALTHttpApi';
	}

	static get info() {
		return {
			author: pJSON.author,
			version: pJSON.version,
			name: pJSON.name,
		};
	}

	get defaults() {
		return {};
	}

	get events() {
		return [];
	}

	get actions() {
		return {};
	}

	async load(channel) {
		this._app = express();
		this._channel = channel;
		this._db = await getDBInstance();
		if (!this._channel) {
			return;
		}
		this._nodeInfo = await this._channel.invoke('app:getNodeInfo');

		this._app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT'] }));
		this._app.use(express.json());

		this._app.get('/api/calt_asset_tokens', async (_req, res) => {
			const caltTokens = await this._channel.invoke('calt:getAllCALTAssetTokens');
			const data = await Promise.all(
				caltTokens.map(async token => {
					const dbKey = `${token.name}`;
					let tokenHistory = await getCALTHistory(this._db, dbKey);
					tokenHistory = tokenHistory.map(h => h.toString('binary'));
					return {
						...token,
						tokenHistory,
					};
				}),
			);

			res.json({ data });
		});

		this._app.get('/api/calt_asset_tokens/:id', async (req, res) => {
			const caltAssetTokens = await this._channel.invoke('calt:getAllCALTAssetTokens');
			const token = caltAssetTokens.find(t => t.id === req.params.id);
			const dbKey = `${token.name}`;
			let tokenHistory = await getCALTHistory(this._db, dbKey);
			tokenHistory = tokenHistory.map(h => h.toString('binary'));

			res.json({ data: { ...token, tokenHistory } });
		});

		this._app.get('/api/calt_liability_tokens', async (_req, res) => {
			const caltTokens = await this._channel.invoke('calt:getAllCALTLiabilityTokens');
			const data = await Promise.all(
				caltTokens.map(async token => {
					const dbKey = `${token.name}`;
					let tokenHistory = await getCALTHistory(this._db, dbKey);
					tokenHistory = tokenHistory.map(h => h.toString('binary'));
					return {
						...token,
						tokenHistory,
					};
				}),
			);

			res.json({ data });
		});

		this._app.get('/api/calt_asset_tokens/:id', async (req, res) => {
			const caltLiabilityTokens = await this._channel.invoke('calt:getAllCALTLiabilityTokens');
			const token = caltLiabilityTokens.find(t => t.id === req.params.id);
			const dbKey = `${token.name}`;
			let tokenHistory = await getCALTHistory(this._db, dbKey);
			tokenHistory = tokenHistory.map(h => h.toString('binary'));

			res.json({ data: { ...token, tokenHistory } });
		});

		this._app.get('/api/transactions', async (_req, res) => {
			const transactions = await getAllTransactions(this._db, this.schemas);

			const data = transactions.map(trx => {
				const module = this._nodeInfo.registeredModules.find(m => m.id === trx.moduleID);
				const asset = module.transactionAssets.find(a => a.id === trx.assetID);
				return {
					...trx,
					...trx.asset,
					moduleName: module.name,
					assetName: asset.name,
				};
			});
			res.json({ data });
		});

		this._subscribeToChannel();

		this._server = this._app.listen(8080, '0.0.0.0');
	}

	_subscribeToChannel() {
		// listen to application events and enrich blockchain data for UI/third party application
		this._channel.subscribe('app:block:new', async data => {
			const { block } = data;
			const { payload } = codec.decode(this.schemas.block, Buffer.from(block, 'hex'));
			if (payload.length > 0) {
				await saveTransactions(this._db, payload);
				const decodedBlock = this.codec.decodeBlock(block);
				// save CALT transaction history
				await saveCALTHistory(
					this._db,
					decodedBlock,
					this._nodeInfo.registeredModules,
					this._channel,
				);
			}
		});
	}

	async unload() {
		// close http server
		await new Promise<void>((resolve, reject) => {
			this._server.close(err => {
				if (err) {
					reject(err);
					return;
				}
				resolve();
			});
		});
		// close database connection
		await this._db.close();
	}
}
