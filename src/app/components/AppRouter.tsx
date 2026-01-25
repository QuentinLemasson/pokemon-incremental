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
        handle: {
          title: 'Home',
        },
      },
      {
        path: 'login',
        element: <LoginPage />,
        handle: {
          title: 'Login',
        },
      },
      {
        path: 'register',
        element: <RegisterPage />,
        handle: {
          title: 'Register',
        },
      },
      {
        path: 'game',
        element: <GamePage />,
        handle: {
          title: 'Game',
        },
      },
      {
        path: 'edition',
        children: [
          {
            path: 'map-gen',
            element: <MapGenPage />,
            handle: {
              title: 'Map Generator',
            },
          },
        ],
      },
      {
        path: '*',
        element: <NotFoundPage />,
        handle: {
          title: '404 - Not Found',
        },
      },
    ],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
