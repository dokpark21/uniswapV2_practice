import React, { useRef, useState, useEffect } from 'react';
import styles from '../styles';
import { ethers } from 'ethers';
import chevron from '../assets/chevron-down.svg';
import { useOnClickOutside, useAmountOut } from '../utils';

export const AmountOut = ({
  fromToken,
  toToken,
  fromTokenValue,
  pairAddress,
  toTokenChange,
  counterTokens,
}) => {
  const [showList, setShowList] = useState(false);
  const [activateToken, setActivateToken] = useState('Select');
  const ref = useRef();
  const amountOut = useAmountOut(
    fromToken,
    toToken,
    fromTokenValue,
    pairAddress
  );

  useOnClickOutside(ref, () => {
    setShowList(false);
  });

  useEffect(() => {
    if (Object.keys(counterTokens).includes(toToken)) {
      setActivateToken(counterTokens[toToken]);
    } else {
      setActivateToken('Select');
    }
  }, [toToken, counterTokens]);

  return (
    <div className={styles.amountContainer}>
      <input
        placeholder="0.0"
        type="number"
        value={ethers.utils.formatUnits(amountOut || '0')}
        className={styles.amountInput}
        disabled
      />

      <div className="relative" onClick={() => setShowList(!showList)}>
        <button className={styles.currencyButton}>
          {activateToken}
          <img
            src={chevron}
            alt="cheveron-down"
            className={`w-4 h-4 object-contain ml-2 ${
              showList ? 'rotate-180' : 'rotate-0'
            }`}
          />
        </button>

        {showList && (
          <ul ref={ref} className={styles.currencyList}>
            {Object.entries(counterTokens).map(([token, tokenName], index) => (
              <li
                key={index}
                className={styles.currencyListItem}
                onClick={() => {
                  toTokenChange(token);
                  setActivateToken(tokenName);
                  setShowList(false);
                }}
              >
                {tokenName}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
