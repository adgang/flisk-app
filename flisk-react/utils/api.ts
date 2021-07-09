export const fetchNodeInfo = async () => {
  return fetch('http://localhost:4000/api/node/info')
    .then((res) => res.json())
    .then((res) => res.data);
};

export const fetchAccountInfo = async (address: any) => {
  return fetch(`http://localhost:4000/api/accounts/${address}`)
    .then((res) => res.json())
    .then((res) => res.data);
};

export const sendTransactions = async (tx: any) => {
  return fetch('http://localhost:4000/api/transactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tx),
  })
    .then((res) => res.json())
    .then((res) => res.data);
};

export const fetchAllCALTAssetTokens = async () => {
  return fetch('http://localhost:8080/api/calt_asset_tokens')
    .then((res) => res.json())
    .then((res) => res.data);
};

export const fetchCALTAssetToken = async (id: any) => {
  return fetch(`http://localhost:8080/api/calt_asset_tokens/${id}`)
    .then((res) => res.json())
    .then((res) => res.data);
};

export const fetchAllCALTLiabilityTokens = async () => {
  return fetch('http://localhost:8080/api/calt_liability_tokens')
    .then((res) => res.json())
    .then((res) => res.data);
};

export const fetchCALTLiabilityToken = async (id: any) => {
  return fetch(`http://localhost:8080/api/calt_liability_tokens/${id}`)
    .then((res) => res.json())
    .then((res) => res.data);
};

export const getAllCALTTransactions = async () => {
  return fetch(`http://localhost:8080/api/transactions`)
    .then((res) => res.json())
    .then((res) => {
      return res.data;
    });
};
