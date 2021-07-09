import { BuybackDebtAsset } from '../../../../../src/app/modules/calt/assets/buyback_debt_asset';

describe('BuybackDebtAsset', () => {
  let transactionAsset: BuybackDebtAsset;

	beforeEach(() => {
		transactionAsset = new BuybackDebtAsset();
	});

	describe('constructor', () => {
		it('should have valid id', () => {
			expect(transactionAsset.id).toEqual(7);
		});

		it('should have valid name', () => {
			expect(transactionAsset.name).toEqual('buybackDebt');
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
