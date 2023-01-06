import { Breadcrumb, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import RestaurantList from '../components/RestaurantList';
import { useQuery } from 'react-query';
import { axiosInstance } from '../axios';

const Restaurants = () => {
  const { data: user } = useQuery(['user'], async () => {
    try {
      const response = await axiosInstance.get('api/user');

      return response?.data;
    } catch {
      return null;
    }
  });

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item active>Restaurants</Breadcrumb.Item>
      </Breadcrumb>
      <div className="d-flex gap-4 justify-content-between">
        <h1>Restaurants</h1>
        {user?.role === 'admin' && (
          <div className="d-flex my-auto">
            <Link to="/restaurant/create">
              <Button>Add restaurant</Button>
            </Link>
          </div>
        )}
      </div>
      <div className="mt-4">
        <RestaurantList />
      </div>
    </>
  );
};

export default Restaurants;
