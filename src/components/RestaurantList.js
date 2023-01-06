import { useQuery, useQueryClient } from 'react-query';
import { axiosInstance } from '../axios';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card } from 'react-bootstrap';

const RestaurantList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user } = useQuery(['user'], async () => {
    try {
      const response = await axiosInstance.get('api/user');

      return response?.data;
    } catch {
      return null;
    }
  });

  const { data: restaurants, isFetched } = useQuery(
    ['restaurants'],
    async () => {
      const response = await axiosInstance.get('api/restourant');

      return response?.data;
    }
  );

  const deleteRestaurant = async (restaurantId) => {
    try {
      await axiosInstance.delete(`api/restourant/${restaurantId}`);

      await queryClient.invalidateQueries(['restaurants']);
    } catch (error) {
      console.log(error);
    }
  };

  if (!isFetched) {
    return null;
  }

  return (
    <div>
      {!restaurants?.length ? (
        <p>Restaurant not found</p>
      ) : (
        restaurants.map((restaurant, index) => (
          <Card key={`restaurant-${index}`} className="p-4 mb-2">
            <h3>{restaurant.title}</h3>
            <div className="d-flex gap-4 justify-content-between">
              <div className="d-flex flex-column pt-2">
                <span>{`City: ${restaurant.city}`}</span>
                <span>{`Address: ${restaurant.address}`}</span>
                <span>{`Working hours: ${restaurant.hours}`}</span>
              </div>
              <div>
                <div className="d-flex gap-2">
                  {user?.role === 'admin' && (
                    <>
                      <Button
                        variant="danger"
                        onClick={() => deleteRestaurant(restaurant.id)}
                      >
                        Delete
                      </Button>
                      <Button
                        variant="warning"
                        onClick={() => {
                          navigate(`/restaurant/${restaurant.id}/edit`);
                        }}
                      >
                        Edit
                      </Button>
                    </>
                  )}
                  <Link to={`/restaurant/${restaurant.id}`}>
                    <Button>Review</Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
};

export default RestaurantList;
