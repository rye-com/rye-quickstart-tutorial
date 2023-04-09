import './index.css';
import Tutorial from './Components/Tutorial';

import { createBrowserRouter } from 'react-router-dom';

import ObtainRyeApiKey from './Components/Tutorial/tutorial-content/obtain-rye-api-key';
import FetchProduct from './Components/Tutorial/tutorial-content/fetch-product';
import AddProductToRye from "./Components/Tutorial/tutorial-content/add-product-to-rye";

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
        path: 'add-to-cart',
        element: <ObtainRyeApiKey />,
      },
      {
        path: 'fetch-cart',
        element: <ObtainRyeApiKey />,
      },
      {
        path: 'display-cart',
        element: <ObtainRyeApiKey />,
      },
      {
        path: 'update-info',
        element: <ObtainRyeApiKey />,
      },
      {
        path: 'payment-form',
        element: <ObtainRyeApiKey />,
      },
      {
        path: 'display-transaction',
        element: <ObtainRyeApiKey />,
      },
    ],
  },
]);

export default router;
