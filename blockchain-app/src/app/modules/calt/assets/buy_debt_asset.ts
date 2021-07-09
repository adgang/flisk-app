import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';

export class BuyDebtAsset extends BaseAsset {
	public name = 'buyDebt';
  public id = 5;

  // Define schema for asset
	public schema = {
    $id: 'calt/buyDebt-asset',
		title: 'BuyDebtAsset transaction asset for calt module',
		type: 'object',
		required: [],
		properties: {},
  };

  public validate({ asset }: ValidateAssetContext<{}>): void {
    // Validate your asset
  }

	// eslint-disable-next-line @typescript-eslint/require-await
  public async apply({ asset, transaction, stateStore }: ApplyAssetContext<{}>): Promise<void> {
		throw new Error('Asset "buyDebt" apply hook is not implemented.');
	}
}
