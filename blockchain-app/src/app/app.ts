import { Application, PartialApplicationConfig, utils } from 'lisk-sdk';
import { registerModules } from './modules';
import { registerPlugins } from './plugins';

export const getApplication = (
	genesisBlock: Record<string, any>,
	config: PartialApplicationConfig,
): Application => {
	// 3.Update the genesis block accounts to include NFT module attributes
	genesisBlock.header.timestamp = 1625812521;
	genesisBlock.header.asset.accounts = genesisBlock.header.asset.accounts.map(a =>
		utils.objects.mergeDeep({}, a, {
			calt: {
				ownAssets: [],
				ownLiabilities: [],
			},
		}),
	);

	// 4.Update application config to include unique label
	// and communityIdentifier to mitigate transaction replay
	const appConfig = utils.objects.mergeDeep({}, config, {
		label: 'flisk-blockchain-app',
		genesisConfig: { communityIdentifier: 'CALT' }, //In order to have a unique networkIdentifier
		logger: {
			consoleLogLevel: 'info',
		},
	});
	const app = Application.defaultApplication(genesisBlock, appConfig);

	registerModules(app);
	registerPlugins(app);

	return app;
};
