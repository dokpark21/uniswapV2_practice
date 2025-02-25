import React from 'react';
import { useEthers } from '@usedapp/core';
import uniswapLogo from './assets/uniswapLogo.png';
import styles from './styles';
import { usePool } from './hooks';

import { WalletButton, Loader, Balance, Exchange } from './components';

export default function App() {
  const { account } = useEthers();
  const [isLoading, pools] = usePool();
  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <header className={styles.header}>
          <img
            src={uniswapLogo}
            alt="uniswap-logo"
            className="w-16 h-16 object-contain"
          />
          <WalletButton />
        </header>
        <div className={styles.exchangeContainer}>
          <h1 className={styles.headTitle}>Uniswap Exchange</h1>
          <p className={styles.subTitle}>
            Connect your wallet to start trading
          </p>
          <div className={styles.exchangeBoxWrapper}>
            <div className={styles.exchangeBox}>
              <div className="pink_gradient" />
              <div className={styles.exchange}>
                {account ? (
                  isLoading ? (
                    <Loader title="Loading pools..." />
                  ) : (
                    <Exchange pools={pools} />
                  )
                ) : (
                  <Loader title="Please connect your wallet..." />
                )}
              </div>
              <div className="blue_gradient" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
