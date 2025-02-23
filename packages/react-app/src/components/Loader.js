import React from 'react';
import styles from '../styles';
import ethereumLogo from '../assets/ethereumLogo.png';

export const Loader = ({ title }) => {
  return (
    <div className={styles.loader}>
      <png
        src={ethereumLogo}
        alt="ethereum logo"
        className={styles.loaderImg}
      ></png>
      <p className={styles.loaderText}>{title}</p>
    </div>
  );
};
