import { Sepolia } from '@usedapp/core';

export const Config = {
  readOnlyChainId: Sepolia.chainId,
  readOnlyUrls: {
    [Sepolia.chainId]:
      'https://eth-sepolia.g.alchemy.com/v2/rMfEpNEOpVcmvOQTXXogZSDxi0BKlcSq',
  },
};

export const RouterAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
