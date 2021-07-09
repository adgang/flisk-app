import { BaseAsset, ApplyAssetContext, ValidateAssetContext } from 'lisk-sdk';

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
				dataType: 'uint32',
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
	public async apply({ asset, transaction, stateStore }: ApplyAssetContext<{}>): Promise<void> {
		throw new Error('Asset "createDebt" apply hook is not implemented.');
	}
}
