import { transactions, codec, cryptography } from '@liskhq/lisk-client';
import { getFullAssetSchema, calcMinTxFee } from '../common';
import { fetchAccountInfo } from '../api';

const schema: any = {
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
      dataType: 'uint64',
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

export const createCALTDebtToken = async ({
  name,
  maturityValue,
  maturityDate,
  minPurchaseMargin,
  passphrase,
  fee,
  networkIdentifier,
  minFeePerByte,
}: any) => {
  const { publicKey } =
    cryptography.getPrivateAndPublicKeyFromPassphrase(passphrase);
  const address = cryptography
    .getAddressFromPassphrase(passphrase)
    .toString('hex');

  const {
    sequence: { nonce },
  } = await fetchAccountInfo(address);

  const assetName = 'createDebt';
  const assetID = 4;
  const moduleId = 4000;

  const { id, ...rest } = transactions.signTransaction(
    schema,
    {
      moduleID: moduleId,
      assetID: assetID,
      nonce: BigInt(nonce),
      fee: BigInt(transactions.convertLSKToBeddows(fee)),
      senderPublicKey: publicKey,
      asset: {
        name,
        maturityValue: BigInt(maturityValue),
        maturityDate: BigInt(maturityDate),
        minPurchaseMargin: parseInt(minPurchaseMargin),
      },
    },
    Buffer.from(networkIdentifier, 'hex'),
    passphrase,
  );

  return {
    id: (id as any).toString('hex'),
    tx: codec.codec.toJSON(getFullAssetSchema(schema) as any, rest),
    minFee: calcMinTxFee(schema, minFeePerByte, rest),
  };
};
