/* eslint-disable @typescript-eslint/no-empty-function */
import { Application, HTTPAPIPlugin } from 'lisk-sdk';
import { CALTAPIPlugin } from './plugins/calt';

export const registerPlugins = (app: Application): void => {
	app.registerPlugin(CALTAPIPlugin);

	app.registerPlugin(HTTPAPIPlugin);
};
