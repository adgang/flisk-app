import { objects } from '@liskhq/lisk-utils';
import { codec, Schema } from '@liskhq/lisk-codec';

export const baseAssetSchema = {
  $id: 'lisk/base-transaction',
  type: 'object',
  required: ['moduleID', 'assetID', 'nonce', 'fee', 'senderPublicKey', 'asset'],
  properties: {
    moduleID: {
      dataType: 'uint32',
      fieldNumber: 1,
    },
    assetID: {
      dataType: 'uint32',
      fieldNumber: 2,
    },
    nonce: {
      dataType: 'uint64',
      fieldNumber: 3,
    },
    fee: {
      dataType: 'uint64',
      fieldNumber: 4,
    },
    senderPublicKey: {
      dataType: 'bytes',
      fieldNumber: 5,
    },
    asset: {
      dataType: 'bytes',
      fieldNumber: 6,
    },
    signatures: {
      type: 'array',
      items: {
        dataType: 'bytes',
      },
      fieldNumber: 7,
    },
  },
};

export const getFullAssetSchema = (assetSchema: {
  $id: string;
  type: string;
  required: string[];
  properties: {
    minPurchaseMargin: { dataType: string; fieldNumber: number };
    initValue: { dataType: string; fieldNumber: number };
    name: { dataType: string; fieldNumber: number };
  };
}) =>
  objects.mergeDeep({}, baseAssetSchema, {
    properties: { asset: assetSchema },
  });

export const calcMinTxFee = (
  assetSchema: Schema,
  minFeePerByte: number,
  tx: any,
) => {
  const assetBytes = codec.encode(assetSchema, tx.asset);
  const bytes = codec.encode(baseAssetSchema, { ...tx, asset: assetBytes });
  console.log(bytes.length);
  console.log(minFeePerByte);
  return BigInt(bytes.length * minFeePerByte);
};
