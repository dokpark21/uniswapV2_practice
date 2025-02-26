import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { DAppProvider } from '@usedapp/core';
import './index.css';

import { Config } from './config';

ReactDOM.render(
  <React.StrictMode>
    <DAppProvider config={Config}>
      <App />
    </DAppProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// 업데이트 요소들
// 1. amountIn, amountOut balance 표기시 해당 토큰 decimal에 맞게 표기
// 2. amountIn, amountOut input에 decimal에 맞게 입력
// 3. amountIn, amountOut input에 max 버튼 추가
// 4. approve, swap 완료 메시지는 3초 후에 사라지도록 수정
// 5. tx hash 표기 및 클릭시 etherscan으로 연결
