import lisk, { apiClient } from '@liskhq/lisk-client';
const RPC_ENDPOINT = 'ws://localhost:8888/ws';

let clientCache: apiClient.APIClient;

export const getClient = async () => {
    if (!clientCache) {
        clientCache = await apiClient.createWSClient(RPC_ENDPOINT);
    }
    return clientCache;
};

export const getAccount = async (address: string) => {
    const client = await getClient()
    try {
        const rec = await client.account.get(address);
        console.log(rec)
    } catch (err) {
        console.error("some error", err)
    }
}


