import React, { useEffect, useState } from 'react';
import {
  useEthers,
  useContractFunction,
  useTokenBalance,
  useTokenAllowance,
} from '@usedapp/core';
import { ethers } from 'ethers';
import abis from '../abis';
import { AmountIn } from './amountIn';
import { AmountOut } from './amoutOut';
import { Balance } from './Balance';
import {
  getAvailableTokens,
  getCounterToken,
  getPairAddress,
  isOperationFailed,
  isOperationPending,
  isOperationSucceed,
  getFailureMessage,
  getSucceedMessage,
} from '../utils';
import { Contract } from '@ethersproject/contracts';
import { ROUTER_ADDRESS } from '../config';

export const Exchange = ({ pools }) => {
  const { account } = useEthers();
  const [fromValue, setFromValue] = useState('0');
  const [fromToken, setFromToken] = useState(pools[0].token0);
  const [toToken, setToToken] = useState('');
  const [reset, setReset] = useState(false);

  const fromValueBigNumber = ethers.utils.parseUnits(fromValue || '0');
  const availableTokens = getAvailableTokens(pools);
  const counterTokens = getCounterToken(fromToken, pools);
  const pairAddress = getPairAddress(fromToken, toToken, pools).pairAddress;

  const routerContract = new Contract(ROUTER_ADDRESS, abis.routerABI);
  const fromTokenContract = new Contract(fromToken, abis.erc20ABI);
  const fromTokenBalance = useTokenBalance(fromToken, account);
  const toTokenBalance = useTokenBalance(toToken, account);
  const fromTokenAllowance =
    useTokenAllowance(fromToken, account) || ethers.utils.parseUnits('0');

  const isAllowanceNeeded = fromValueBigNumber.gt(fromTokenAllowance);
  const isInputValueGtThanZero = fromValueBigNumber.gt(
    ethers.utils.parseUnits('0')
  );

  const hasEnoughBalance = fromValueBigNumber.lte(fromTokenBalance);

  const {
    state: approveBeforeSwapState,
    send: sendApprove,
  } = useContractFunction(fromTokenContract, 'approve', {
    transactionName: 'ApproveBeforeSwap',
    gasLimitBufferPercentage: 10,
  });

  const { state: swapState, send: sendSwap } = useContractFunction(
    routerContract,
    'swapExactTokensForTokens',
    {
      transactionName: 'ExecuteSwap',
      gasLimitBufferPercentage: 10,
    }
  );

  const isApproving = isOperationPending(approveBeforeSwapState);
  const isSwapping = isOperationPending(swapState);
  const canApprove = isAllowanceNeeded && !isApproving;
  const canSwap =
    isInputValueGtThanZero &&
    !isSwapping &&
    hasEnoughBalance &&
    !isAllowanceNeeded;

  const succeedMessage = getSucceedMessage(swapState, approveBeforeSwapState);
  const failureMessage = getFailureMessage(swapState, approveBeforeSwapState);

  return (
    <div className="flex flex-col w-full items-center">
      <div className="mb-8">
        <AmountIn />
        <Balance />
      </div>

      <div>
        <div className="mb-8 w-[100%]">
          <AmountOut />
          <Balance />
        </div>
      </div>
    </div>
  );
};
