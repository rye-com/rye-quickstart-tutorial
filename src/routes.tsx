import './index.css';
import Tutorial from './Components/Tutorial';

import { createBrowserRouter } from 'react-router-dom';

import GettingStarted from './Components/Tutorial/tutorial-content/getting-started';
import FetchProduct from './Components/Tutorial/tutorial-content/fetch-product';
import AddProduct from './Components/Tutorial/tutorial-content/add-product';

//App is wrapper component. Children components are rendered in place of <Outline />
const router = createBrowserRouter([
  {
    path: '/',
    element: <Tutorial />,
    children: [
      {
        path: '/',
        element: <GettingStarted />,
      },
      {
        path: 'start',
        element: <GettingStarted />,
      },
      {
        path: 'get-key',
        element: <GettingStarted />,
      },
      {
        path: 'product-data',
        element: <FetchProduct />,
      },
      {
        path: 'add-product',
        element: <AddProduct />,
      },
      {
        path: 'add-to-cart',
        element: <GettingStarted />,
      },
      {
        path: 'fetch-cart',
        element: <GettingStarted />,
      },
      {
        path: 'display-cart',
        element: <GettingStarted />,
      },
      {
        path: 'update-info',
        element: <GettingStarted />,
      },
      {
        path: 'payment-form',
        element: <GettingStarted />,
      },
      {
        path: 'display-transaction',
        element: <GettingStarted />,
      },
    ],
  },
]);

export default router;
