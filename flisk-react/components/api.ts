import lisk, { apiClient } from '@liskhq/lisk-client';
const RPC_ENDPOINT = 'ws://localhost:8888/ws';

let clientCache: apiClient.APIClient;

export const getClient = async () => {
    if (!clientCache) {
        clientCache = await apiClient.createWSClient(RPC_ENDPOINT);
    }
    return clientCache;
};

export const getAccount = async () => {
    const client = await getClient()
    const rec = await client.account.get('efc8d9b05c6e911fb38713c963eeb02a9989c036');
    console.info(rec)
}


