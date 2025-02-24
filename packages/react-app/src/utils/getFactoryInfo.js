import abis from '../abis';
import { GetPairInfo } from './getPairInfo';

export const getFactoryInfo = async (web3, factoryAddress) => {
  const factory = new web3.eth.Contract(abis.factoryABI, factoryAddress);

  const factoryInfo = {
    feeTo: await factory.methods.feeTo().call(),
    feeToSetter: await factory.methods.feeToSetter().call(),
    allPairsLength: await factory.methods.allPairsLength().call,
    allPairs: [],
  };

  for (let i = 0; i < factoryInfo.allPairsLength; i++) {
    factoryInfo.allPairs.push(factory.methods.allPairs(i).call());
  }

  factoryInfo.pairsInfo = await GetPairInfo(web3, factoryInfo.allPairs);

  return factoryInfo;
};
