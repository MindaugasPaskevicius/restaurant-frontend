import { Route, Routes } from 'react-router-dom';

import Login from '../pages/Login';
import Register from '../pages/Register';
import Restaurants from '../pages/Restaurants';
import Restaurant from '../pages/Restaurant';
import CreateRestaurant from '../pages/CreateRestaurant';
import EditRestaurant from '../pages/EditRestaurant';
import CreateDish from '../pages/CreateDish';
import EditDish from '../pages/EditDish';
import UserGuard from './UserGuard';
import GuestGuard from './GuestGuard';
import Layout from './Layout';

const Router = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route element={<GuestGuard />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Route>
      <Route element={<Layout />}>
        <Route element={<UserGuard />}>
          <Route path="/" element={<Restaurants />} />
          <Route path="/restaurant/:id" element={<Restaurant />} />
          <Route path="/restaurant/create" element={<CreateRestaurant />} />
          <Route path="/restaurant/:id/edit" element={<EditRestaurant />} />
          <Route path="/restaurant/:id/dish/create" element={<CreateDish />} />
          <Route
            path="/restaurant/:restaurantId/dish/:dishId/edit"
            element={<EditDish />}
          />
        </Route>
      </Route>
    </Routes>
  );
};

export default Router;
