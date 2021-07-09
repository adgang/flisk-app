import { BuyDebtAsset } from '../../../../../src/app/modules/calt/assets/buy_debt_asset';

describe('BuyDebtAsset', () => {
  let transactionAsset: BuyDebtAsset;

	beforeEach(() => {
		transactionAsset = new BuyDebtAsset();
	});

	describe('constructor', () => {
		it('should have valid id', () => {
			expect(transactionAsset.id).toEqual(5);
		});

		it('should have valid name', () => {
			expect(transactionAsset.name).toEqual('buyDebt');
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
