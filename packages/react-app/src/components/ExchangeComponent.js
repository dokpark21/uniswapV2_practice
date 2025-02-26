import React, { useEffect, useState } from 'react';
import {
  ERC20,
  useEthers,
  useContractFunction,
  useTokenBalance,
  useTokenAllowance,
} from '@usedapp/core';
import { ethers } from 'ethers';
import abis from '../abis';
import { AmountIn } from './AmountIn';
import { AmountOut } from './AmountOut';
import { Balance } from './Balance';
import {
  getAvailableTokens,
  getCounterToken,
  getPairAddress,
  isOperationPending,
  getFailureMessage,
  getSucceedMessage,
} from '../utils';
import { Contract } from '@ethersproject/contracts';
import { RouterAddress, Config } from '../config';
import styles from '../styles';

export const Exchange = ({ pools }) => {
  const { library, account } = useEthers();
  const provider = library?.getSigner() || library;
  const [fromValue, setFromValue] = useState('');
  const [fromToken, setFromToken] = useState(pools[0].token0);
  const [toToken, setToToken] = useState('');
  const [reset, setReset] = useState(false);

  const fromValueBigNumber = ethers.utils.parseUnits(fromValue || '0');
  const availableTokens = getAvailableTokens(pools);
  const counterTokens = getCounterToken(fromToken, pools);
  const pairAddress =
    getPairAddress(fromToken, toToken, pools)?.pairAddress ?? '';

  const routerContract = new Contract(RouterAddress, abis.routerABI, provider);
  const fromTokenContract = new Contract(fromToken, ERC20.abi, provider);

  const fromTokenBalance = useTokenBalance(fromToken, account);
  const toTokenBalance = useTokenBalance(toToken, account);
  const fromTokenAllowance =
    useTokenAllowance(fromToken, account, RouterAddress) ||
    ethers.utils.parseUnits('0');

  const isAllowanceNeeded = fromValueBigNumber.gt(
    fromTokenAllowance ?? ethers.utils.parseUnits('0')
  );
  const isInputValueGtThanZero = fromValueBigNumber.gt(
    ethers.utils.parseUnits('0')
  );

  const hasEnoughBalance = fromValueBigNumber.lte(
    fromTokenBalance ?? ethers.utils.parseUnits('0')
  );

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

  const approveRequest = async () => {
    await sendApprove(RouterAddress, fromValueBigNumber);
  };

  const swapRequest = async () => {
    await sendSwap(
      fromValueBigNumber,
      ethers.utils.parseUnits('0'),
      [fromToken, toToken],
      account,
      Date.now() + 1000 * 60 * 10
    ).then(() => {
      setFromValue('0');
    });
  };

  const fromTokenChange = (value) => {
    setFromToken(value);
    setToToken('');
  };

  const toTokenChange = (value) => {
    setToToken(value);
  };

  const fromValueChange = (value) => {
    const trimmedValue = value.trim();

    trimmedValue && ethers.utils.parseUnits(trimmedValue);
    setFromValue(trimmedValue);
  };

  useEffect(() => {
    if (succeedMessage || failureMessage) {
      setTimeout(() => {
        setReset(true);
        setFromValue('');
        setFromToken('');
        setToToken('');
      }, 5000);
    }
  }, [succeedMessage, failureMessage]);

  return (
    <div className="flex flex-col w-full items-center">
      <div className="mb-8">
        <AmountIn
          value={fromValue}
          tokenChange={fromTokenChange}
          valueChange={fromValueChange}
          fromToken={fromToken}
          availableTokens={availableTokens}
          isSwapping={isSwapping && hasEnoughBalance}
        />
        <Balance balance={fromTokenBalance} />
      </div>

      <div>
        <div className="mb-8 w-[100%]">
          <AmountOut
            fromToken={fromToken}
            toToken={toToken}
            fromTokenValue={fromValueBigNumber}
            pairAddress={pairAddress}
            toTokenChange={toTokenChange}
            counterTokens={counterTokens}
          />
          <Balance balance={toTokenBalance} />
        </div>

        {isAllowanceNeeded && !isSwapping ? (
          <button
            className={`${
              canApprove
                ? 'bg-site-pink text-white'
                : 'bg-site-dim2 text-site-dim2'
            } ${styles.actionButton}`}
            onClick={approveRequest}
            disabled={!canApprove || !hasEnoughBalance}
          >
            {isApproving
              ? 'Approving...'
              : hasEnoughBalance
              ? 'Approve'
              : 'Insufficient Balance'}
          </button>
        ) : (
          <button
            className={`${
              canSwap
                ? 'bg-site-pink text-white'
                : 'bg-site-dim2 text-site-dim2'
            } ${styles.actionButton}`}
            onClick={swapRequest}
            disabled={!canSwap}
          >
            {isSwapping
              ? 'Swapping...'
              : hasEnoughBalance
              ? 'Swap'
              : 'Insufficient Balance'}
          </button>
        )}

        {failureMessage && !reset ? (
          <p className={styles.message}>{failureMessage}</p>
        ) : succeedMessage ? (
          <p className={styles.message}>{succeedMessage}</p>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};
