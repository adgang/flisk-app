import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';

export class CreateDebtAsset extends BaseAsset {
	public name = 'createDebt';
  public id = 4;

  // Define schema for asset
	public schema = {
    $id: 'calt/createDebt-asset',
		title: 'CreateDebtAsset transaction asset for calt module',
		type: 'object',
		required: [],
		properties: {},
  };

  public validate({ asset }: ValidateAssetContext<{}>): void {
    // Validate your asset
  }

	// eslint-disable-next-line @typescript-eslint/require-await
  public async apply({ asset, transaction, stateStore }: ApplyAssetContext<{}>): Promise<void> {
		throw new Error('Asset "createDebt" apply hook is not implemented.');
	}
}
