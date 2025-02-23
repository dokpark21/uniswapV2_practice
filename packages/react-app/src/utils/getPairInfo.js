import abis from '../abis';

export const GetPairInfo = async (web3, allPairs) => {
  const pairsInfo = [];

  for (let i = 0; i < allPairs.length; i++) {
    const pair = new web3.eth.Contract(abis.pairABI, allPairs[i]);
    const token0 = await pair.methods.token0().call();
    const token1 = await pair.methods.token1().call();
    const reserves = await pair.methods.getReserves().call();
    const token0Info = await getTokenInfo(web3, token0);
    const token1Info = await getTokenInfo(web3, token1);

    pairsInfo.push({
      token0,
      token1,
      reserves,
      token0Info,
      token1Info,
    });
  }

  return pairsInfo;
};

const getTokenInfo = async (token) => {
  const tokenName = await token.methods.name().call();
  const tokenSymbol = await token.methods.symbol().call();
  const tokenDecimals = await token.methods.decimals().call();
  const tokenTotalSupply = await token.methods.totalSupply().call();

  return {
    name: tokenName,
    symbol: tokenSymbol,
    decimals: tokenDecimals,
    totalSupply: tokenTotalSupply,
  };
};
