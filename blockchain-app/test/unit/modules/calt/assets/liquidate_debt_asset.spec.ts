import { LiquidateDebtAsset } from '../../../../../src/app/modules/calt/assets/liquidate_debt_asset';

describe('LiquidateDebtAsset', () => {
  let transactionAsset: LiquidateDebtAsset;

	beforeEach(() => {
		transactionAsset = new LiquidateDebtAsset();
	});

	describe('constructor', () => {
		it('should have valid id', () => {
			expect(transactionAsset.id).toEqual(6);
		});

		it('should have valid name', () => {
			expect(transactionAsset.name).toEqual('liquidateDebt');
		});

		it('should have valid schema', () => {
			expect(transactionAsset.schema).toMatchSnapshot();
		});
	});

	describe('validate', () => {
		describe('schema validation', () => {
      it.todo('should throw errors for invalid schema');
      it.todo('should be ok for valid schema');
    });
	});

	describe('apply', () => {
    describe('valid cases', () => {
      it.todo('should update the state store');
    });

    describe('invalid cases', () => {
      it.todo('should throw error');
    });
	});
});
