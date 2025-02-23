import React, { useEffect, useState } from 'react';
import { shortenAddress, useEthers, useLookupAddress } from '@usedapp/core';
import styles from '../styles';

export const WalletButton = () => {
  const [rendered, setRendered] = useState('');
  const { account, activateBrowserWallet, deactivate } = useEthers();
  const { ensName } = useLookupAddress();

  useEffect(() => {
    if (ensName) {
      setRendered(ensName);
    } else if (account) {
      setRendered(shortenAddress(account));
    } else {
      setRendered('');
    }
  }, [account, ensName]);

  const onClickHandler = () => {
    if (!account) {
      activateBrowserWallet();
    } else {
      deactivate();
    }
  };

  return (
    <button className={styles.walletButton} onClick={onClickHandler}>
      {rendered === '' && 'Connect Wallet'}
      {rendered !== '' && rendered}
    </button>
  );
};
