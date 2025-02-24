export const getAvailableTokens = (pools) => {
  return pools.reduce((prev, curr) => {
    prev[curr.token0] = curr.token0Info.name;
    prev[curr.token1] = curr.token1Info.name;
    return prev;
  }, {});
};

export const getCounterToken = (fromToken, pools) => {
  return pools
    .filter((curr) => curr.token0 === fromToken || curr.token1 === fromToken)
    .reduce((prev, curr) => {
      if (curr.token0 === fromToken) {
        prev[curr.token1] = curr.token1Info.name;
      } else if (curr.token1 === fromToken) {
        prev[curr.token0] = curr.token0Info.name;
      }
      return prev;
    }, {});
};

export const getPairAddress = (token0, token1, pools) => {
  return pools.find((curr) => {
    return (
      (curr.token0 === token0 && curr.token1 === token1) ||
      (curr.token0 === token1 && curr.token1 === token0)
    );
  });
};

export const isOperationPending = (operationState) => {
  return (
    operationState.status === 'Mining' ||
    operationState.status === 'PendingSignature'
  );
};

export const isOperationSucceed = (operationState) => {
  return operationState.status === 'Success';
};

export const isOperationFailed = (operationState) => {
  return (
    operationState.status === 'Fail' || operationState.status === 'Exception'
  );
};

export const getFailureMessage = (swapState, approveState) => {
  if (isOperationPending(approveState) || isOperationPending(swapState)) {
    return 'Operation is pending';
  }

  if (isOperationFailed(approveState)) {
    return 'Approve Failed - ' + approveState.errorMessage;
  }

  if (isOperationFailed(swapState)) {
    return 'Swap Failed - ' + swapState.errorMessage;
  }

  return undefined;
};

export const getSucceedMessage = (swapState, approveState) => {
  if (isOperationPending(swapState) || isOperationPending(approveState)) {
    return 'Operation is pending';
  }

  if (isOperationSucceed(swapState)) {
    return 'Swap Succeed';
  }

  if (isOperationSucceed(approveState)) {
    return 'Approve Succeed';
  }

  return undefined;
};
