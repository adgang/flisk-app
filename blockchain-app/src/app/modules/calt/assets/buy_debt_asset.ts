import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';
import { getAllCALTAssetTokens, setAllCALTAssetTokens } from '../calt';

export class BuyDebtAsset extends BaseAsset {
	public name = 'buyDebt';
	public id = 5;

	// Define schema for asset
	public schema = {
		$id: 'calt/debtasset/buy',
		title: 'BuyDebtAsset transaction asset for calt module',
		type: 'object',
		required: ['debtAssetId', 'purchaseValue', 'name'],
		properties: {
			debtAssetId: {
				dataType: 'bytes',
				fieldNumber: 1,
			},
			purchaseValue: {
				dataType: 'uint64',
				fieldNumber: 2,
			},
			name: {
				dataType: 'string',
				fieldNumber: 3,
			},
		},
	};

	// eslint-disable-next-line @typescript-eslint/require-await
	public async apply({
		asset,
		transaction,
		stateStore,
		reducerHandler,
	}: ApplyAssetContext<any>): Promise<void> {
		const allAssetTokens = await getAllCALTAssetTokens(stateStore);
		const assetTokenIndex = allAssetTokens.findIndex(t => t.id.equals(asset.debtAssetId));

		if (assetTokenIndex < 0) {
			throw new Error('Asset token id not found');
		}

		// verify if minimum purchasing condition met(debt maturity value is higher than current value.
		// This is a simplistic assumption and doesn't cover -ve time value addition/aka -ve interest rates)
		const token = allAssetTokens[assetTokenIndex];
		const tokenOwner: any = await stateStore.account.get(token.ownerAddress);
		const tokenOwnerAddress = tokenOwner.address;

		if (token && token.maturityValue < asset.purchaseValue) {
			throw new Error('This debt asset token can not be purchased at a value higher than maturity');
		}

		// remove asset token from owner account
		const purchaserAddress = transaction.senderAddress;
		const purchaserAccount: any = await stateStore.account.get(purchaserAddress);

		const ownerTokenIndex = tokenOwner.calt.ownAssets.findIndex(a => a.equals(token.id));
		tokenOwner.calt.ownAssets.splice(ownerTokenIndex, 1);
		await stateStore.account.set(tokenOwnerAddress, tokenOwner);

		// add nft to purchaser account
		purchaserAccount.calt.ownAssets.push(token.id);
		await stateStore.account.set(purchaserAddress, purchaserAccount);

		token.ownerAddress = purchaserAddress;

		// save all tokens
		await setAllCALTAssetTokens(stateStore, allAssetTokens);

		// debit LSK tokens from purchaser account
		await reducerHandler.invoke('token:debit', {
			address: purchaserAddress,
			amount: asset.purchaseValue,
		});

		// credit LSK tokens to purchaser account
		await reducerHandler.invoke('token:credit', {
			address: tokenOwnerAddress,
			amount: asset.purchaseValue,
		});
	}
}
