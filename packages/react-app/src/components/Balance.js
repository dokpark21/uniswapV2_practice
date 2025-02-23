import React from 'react';
import styles from '../styles';
import { ethers } from 'ethers';

export const Balance = ({ balance }) => {
  return (
    <div className={styles.balance}>
      <p className={styles.balanceText}>
        {balance ? (
          <>
            <span className={styles.balanceBold}>Balance: </span>
            {ethers.utils.formatUnits(balance ?? ethers.utils.parseUnits('0'))}
          </>
        ) : (
          ''
        )}
      </p>
    </div>
  );
};
