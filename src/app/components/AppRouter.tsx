import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RootLayout } from '../layout/RootLayout';
import {
  LandingPage,
  LoginPage,
  RegisterPage,
  GamePage,
  MapGenPage,
  NotFoundPage,
} from '@/app/pages';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'game',
        element: <GamePage />,
      },
      {
        path: 'edition',
        children: [
          {
            path: 'map-gen',
            element: <MapGenPage />,
          },
        ],
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
