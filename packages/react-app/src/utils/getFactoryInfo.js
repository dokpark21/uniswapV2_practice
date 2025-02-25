import abis from '../abis';
import { getPairInfo } from './getPairInfo';

export const getFactoryInfo = async (web3, factoryAddress) => {
  const factory = new web3.eth.Contract(abis.factoryABI, factoryAddress);

  const factoryInfo = {
    feeTo: await factory.methods.feeTo().call(),
    feeToSetter: await factory.methods.feeToSetter().call(),
    allPairsLength: await factory.methods.allPairsLength().call(),
    allPairs: [],
  };

  for (let i = 0; i < factoryInfo.allPairsLength; i++) {
    factoryInfo.allPairs[i] = await factory.methods.allPairs(i).call();
  }

  factoryInfo.pairsInfo = await getPairInfo(web3, factoryInfo.allPairs);
  return factoryInfo;
};
