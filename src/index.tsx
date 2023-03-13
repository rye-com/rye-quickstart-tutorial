import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import reportWebVitals from './reportWebVitals';
import { isProd } from './utils/env/isProd';
import { queryParameters } from './utils/getParams.utils';
import { RouterProvider } from 'react-router-dom';
import router from './routes';

Sentry.init({
  dsn: 'https://c562accb379a48369cd1eeb950a00f8a@o4504131870916608.ingest.sentry.io/4504131892805632',
  integrations: [new BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,

  environment: isProd ? 'production' : 'development',
});

if (!!Number(queryParameters.get('compact'))) {
  const resizeObserver = new ResizeObserver((entries) => {
    window.parent.postMessage(
      {
        message: 'tutorial-window-height',
        data: entries[0]?.target.clientHeight,
      },
      '*', // mostly used by console.rye.com to display this page in IFrame for the Onboarding Dashboard page
    );
  });
  resizeObserver.observe(document.body);
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
