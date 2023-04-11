import './index.css';
import Tutorial from './Components/Tutorial/index-new';

import { createBrowserRouter } from 'react-router-dom';

import ObtainRyeApiKey from './Components/Tutorial/tutorial-content/obtain-rye-api-key';
import FetchProduct from './Components/Tutorial/tutorial-content/fetch-product';
import AddProductToRye from "./Components/Tutorial/tutorial-content/add-product-to-rye";
import ManageCart from "./Components/Tutorial/tutorial-content/ManageCart";
import ManageCheckout from "./Components/Tutorial/tutorial-content/ManageCheckout";
import DisplayTransactions from "./Components/Tutorial/tutorial-content/DisplayTransactions";

//App is wrapper component. Children components are rendered in place of <Outline />
const router = createBrowserRouter([
  {
    path: '/',
    element: <Tutorial />,
    children: [
      {
        path: '/',
        element: null,
      },
      {
        path: 'start',
        element: null,
      },
      {
        path: 'get-key',
        element: <ObtainRyeApiKey />,
      },
      {
        path: 'product-data',
        element: <FetchProduct />,
      },
      {
        path: 'add-product',
        element: <AddProductToRye />,
      },
      {
        path: 'manage-a-cart',
        element: <ManageCart />,
      },
      {
        path: 'manage-checkout',
        element: <ManageCheckout />,
      },
      {
        path: 'display-transaction',
        element: <DisplayTransactions />,
      },
    ],
  },
]);

export default router;
