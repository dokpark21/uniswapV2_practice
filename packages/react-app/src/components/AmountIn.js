import React, { useState, useRef, useEffect } from 'react';
import styles from '../styles';
import chevron from '../assets/chevron-down.svg';
import { useOnClickOutside } from '../utils';

export const AmountIn = ({
  value,
  tokenChange,
  valueChange,
  fromToken,
  availableTokens,
  isSwapping,
}) => {
  const [showList, setShowList] = useState(false);
  const [activateToken, setActivateToken] = useState('Select');
  const ref = useRef();

  useOnClickOutside(ref, () => {
    setShowList(false);
  });

  useEffect(() => {
    if (Object.keys(availableTokens).includes(fromToken)) {
      setActivateToken(availableTokens[fromToken]);
    } else {
      setActivateToken('Select');
    }
  }, [fromToken, availableTokens]);

  return (
    <div className={styles.amountContainer}>
      <input
        className={styles.amountInput}
        placeholder="0.0"
        type="number"
        value={value}
        onChange={(e) => valueChange(e.target.value)}
      />

      <div className="relative" onClick={() => setShowList(!showList)}>
        <button className={styles.currencyButton}>
          {activateToken}
          <img
            src={chevron}
            alt="chevron"
            className={`w-4 h-4 object-contain ml-2 ${
              showList ? 'rotate-180' : 'rotate-0'
            }`}
          />
        </button>

        {showList && (
          <ul className={styles.currencyList} ref={ref}>
            {Object.entries(availableTokens).map(
              ([token, tokenName], index) => (
                <li
                  key={index}
                  className={`${styles.currencyListItem} ${
                    activateToken === tokenName ? 'bg-site-dim2' : ''
                  } cursor-pointer`}
                  onClick={() => {
                    setActivateToken(tokenName);
                    tokenChange(token);
                    setShowList(false);
                  }}
                >
                  {tokenName}
                </li>
              )
            )}
          </ul>
        )}
      </div>
    </div>
  );
};
