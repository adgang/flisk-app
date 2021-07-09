import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';

export class BuybackDebtAsset extends BaseAsset {
	public name = 'buybackDebt';
  public id = 7;

  // Define schema for asset
	public schema = {
    $id: 'calt/buybackDebt-asset',
		title: 'BuybackDebtAsset transaction asset for calt module',
		type: 'object',
		required: [],
		properties: {},
  };

  public validate({ asset }: ValidateAssetContext<{}>): void {
    // Validate your asset
  }

	// eslint-disable-next-line @typescript-eslint/require-await
  public async apply({ asset, transaction, stateStore }: ApplyAssetContext<{}>): Promise<void> {
		throw new Error('Asset "buybackDebt" apply hook is not implemented.');
	}
}
