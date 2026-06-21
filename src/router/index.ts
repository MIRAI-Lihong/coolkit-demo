import {createBrowserRouter} from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    async lazy() {
      const {default: Home} = await import('../pages/Home');
      return {Component: Home};
    }
  },
  {
    path: '/login',
    async lazy() {
      const {default: Login} = await import('../pages/Login');
      return {Component: Login};
    }
  }
]);

export {router};
