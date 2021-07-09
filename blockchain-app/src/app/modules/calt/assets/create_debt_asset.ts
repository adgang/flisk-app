import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';
import {
	getAllCALTAssetTokens,
	setAllCALTAssetTokens,
	getAllCALTAssetTokensAsJSON,
	getAllCALTLiabilityTokens,
	setAllCALTLiabilityTokens,
	getAllCALTLiabilityTokensAsJSON,
	createCALTAssetLiabilityTokens,
} from '../calt';

export class CreateDebtAsset extends BaseAsset {
	public name = 'createDebt';
	public id = 4;

	// Define schema for asset
	public schema = {
		$id: 'calt/createDebt-asset',
		title: 'CreateDebtAsset transaction asset for calt module',
		type: 'object',
		required: ['minPurchaseMargin', 'maturityValue', 'name', 'maturityDate'],
		properties: {
			minPurchaseMargin: {
				dataType: 'uint32',
				fieldNumber: 1,
			},
			maturityValue: {
				dataType: 'uint64',
				fieldNumber: 2,
			},
			name: {
				dataType: 'string',
				fieldNumber: 3,
			},
			// unixtime ms of maturity date
			maturityDate: {
				dataType: 'uint64',
				fieldNumber: 4,
			},
		},
	};

	public validate({ asset }: any): void {
		// Validate your asset
		// Debt has to be created only for future maturity
		if (asset.maturityDate < Date.now() + 100000) {
			throw new Error("Debt's maturity should be in future.");
		} else if (asset.minPurchaseMargin < 0) {
			throw new Error('The debt minimum purchase value needs to be above 0.');
		}
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async apply({
		asset,
		stateStore,
		reducerHandler,
		transaction,
	}: ApplyAssetContext<any>): Promise<void> {
		const senderAddress = transaction.senderAddress;
		const senderAccount: any = await stateStore.account.get(senderAddress);

		// create asset and liability tokens
		const tokens = createCALTAssetLiabilityTokens({
			name: asset.name,
			ownerAddress: senderAddress,
			nonce: transaction.nonce,
			maturityValue: asset.maturityValue,
			maturityDate: asset.maturityDate,
		});

		// update sender account with asset and liability tokens
		senderAccount.calt.ownAssets.push(tokens.assetToken);
		senderAccount.calt.ownLiabilities.push(tokens.liabilityToken);
		await stateStore.account.set(senderAddress, senderAccount);

		// save asset and liability tokens
		const allAssetTokens = await getAllCALTAssetTokens(stateStore);
		const allLiabilityTokens = await getAllCALTLiabilityTokens(stateStore);

		allAssetTokens.push(tokens.assetToken);
		allLiabilityTokens.push(tokens.liabilityToken);
		await setAllCALTAssetTokens(stateStore, allAssetTokens);
		await setAllCALTLiabilityTokens(stateStore, allLiabilityTokens);
	}
}
