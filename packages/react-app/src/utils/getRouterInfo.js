import abis from '../abis';

export const getRouterInfo = async (web3, routerAddress) => {
  const router = new web3.eth.Contract(abis.routerABI, routerAddress);
  return {
    factory: await router.methods.factory().call(),
  };
};
