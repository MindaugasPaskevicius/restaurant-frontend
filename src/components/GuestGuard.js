import { Navigate, Outlet } from 'react-router-dom';
import { useQuery } from 'react-query';

import { axiosInstance } from '../axios';

const GuestGuard = () => {
  const { data: user, isFetched } = useQuery(['user'], async () => {
    try {
      const response = await axiosInstance.get('api/user');

      return response?.data;
    } catch {
      return null;
    }
  });

  if (!isFetched) {
    return null;
  }

  if (user) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default GuestGuard;
