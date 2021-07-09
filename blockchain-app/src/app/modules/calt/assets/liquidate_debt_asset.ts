import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';

export class LiquidateDebtAsset extends BaseAsset {
	public name = 'liquidateDebt';
  public id = 6;

  // Define schema for asset
	public schema = {
    $id: 'calt/liquidateDebt-asset',
		title: 'LiquidateDebtAsset transaction asset for calt module',
		type: 'object',
		required: [],
		properties: {},
  };

  public validate({ asset }: ValidateAssetContext<{}>): void {
    // Validate your asset
  }

	// eslint-disable-next-line @typescript-eslint/require-await
  public async apply({ asset, transaction, stateStore }: ApplyAssetContext<{}>): Promise<void> {
		throw new Error('Asset "liquidateDebt" apply hook is not implemented.');
	}
}
