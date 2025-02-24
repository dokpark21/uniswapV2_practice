import Web3 from 'web3';
import { useEffect, useState } from 'react';
import { RouterAddress } from '../config';
import { getRouterInfo, getFactoryInfo } from '../utils';
import { useConfig } from '@usedapp/core';

export const loadPool = async (providerUrl) => {
  const provider = new Web3.providers.HttpProvider(providerUrl);
  const web3 = new Web3(provider);

  // get router and factory info
  const routerInfo = await getRouterInfo(web3, RouterAddress);
  const factoryInfo = await getFactoryInfo(web3, routerInfo.factory);

  return factoryInfo.pairsInfo;
};

export const usePool = () => {
  const { readOnlyChainId, readOnlyUrls } = useConfig();
  const [loading, setLoading] = useState(true);
  const [pools, setPools] = useState({});

  useEffect(() => {
    loadPool(readOnlyUrls[readOnlyChainId])
      .then((pools) => {
        setPools(pools);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [readOnlyChainId, readOnlyUrls]);

  return [loading, pools];
};
