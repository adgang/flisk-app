import { BaseChannel, BasePlugin } from 'lisk-sdk';

// import * as pJSON from '../../../package.json';
const pJSON = {
	author: 'Aditya',
	version: '0.1.0',
	name: 'flisk',
};

export class CALTAPIPlugin extends BasePlugin {
	load(channel: BaseChannel): Promise<void> {
		throw new Error('Method not implemented.');
	}
	unload(): Promise<void> {
		throw new Error('Method not implemented.');
	}
	_server = undefined;
	_app = undefined;
	_channel = undefined;
	_db = undefined;
	_nodeInfo = undefined;

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
}
