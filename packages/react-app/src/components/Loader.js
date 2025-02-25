import React from 'react';
import styles from '../styles';
import ethereumLogo from '../assets/ethereumLogo.png';

export const Loader = ({ title }) => {
  return (
    <div className={styles.loader}>
      <img
        src={ethereumLogo}
        alt="ethereum logo"
        className={styles.loaderImg}
      ></img>
      <p className={styles.loaderText}>{title}</p>
    </div>
  );
};
