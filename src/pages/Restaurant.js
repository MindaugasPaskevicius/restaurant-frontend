import { Breadcrumb, Button, Card } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { axiosInstance } from '../axios';
import DishListItem from '../components/DishListItem';

const Restaurant = () => {
  let { id } = useParams();

  const { data: user } = useQuery(['user'], async () => {
    try {
      const response = await axiosInstance.get('api/user');

      return response?.data;
    } catch {
      return null;
    }
  });

  const { data: restaurant, isFetched } = useQuery(
    ['restaurant', id],
    async () => {
      const response = await axiosInstance.get(`/api/restourant/${id}`);

      return response?.data;
    }
  );

  if (!isFetched || !restaurant) {
    return null;
  }

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>
          Restaurants
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Restaurant</Breadcrumb.Item>
      </Breadcrumb>
      <h1>{restaurant.title}</h1>
      <Card className="d-flex flex-column mt-4 p-4">
        <span>{`City: ${restaurant.city}`}</span>
        <span>{`Address: ${restaurant.address}`}</span>
        <span>{`Working hours: ${restaurant.hours}`}</span>
      </Card>
      <div className="mt-4">
        <div className="d-flex justify-content-between">
          <h3>Meniu</h3>
          {user?.role === 'admin' && (
            <Link to={`/restaurant/${restaurant.id}/dish/create`}>
              <Button>Add dish</Button>
            </Link>
          )}
        </div>
        <div className="d-flex flex-column mt-4">
          {restaurant?.dishes?.length ? (
            restaurant.dishes.map((dish) => (
              <DishListItem
                key={`dish-${dish.id}`}
                dishId={dish.id}
                restaurantId={restaurant.id}
                title={dish.title}
                price={dish.price}
                rating={dish.rating}
              />
            ))
          ) : (
            <span>Dish not found</span>
          )}
        </div>
      </div>
    </>
  );
};

export default Restaurant;
