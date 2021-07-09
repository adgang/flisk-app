/* eslint-disable @typescript-eslint/no-empty-function */
import { Application } from 'lisk-sdk';
import { CaltModule } from './modules/calt/calt_module';

export const registerModules = (app: Application): void => {
	app.registerModule(CaltModule);
};
