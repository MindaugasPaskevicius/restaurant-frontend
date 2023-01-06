import { useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from 'react-query';

import { axiosInstance } from '../axios';

const userRatings = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const DishListItem = ({ restaurantId, dishId, title, price, rating }) => {
  const queryClient = useQueryClient();

  const [ratingSet, setRatingSet] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);

  const { data: user } = useQuery(['user'], async () => {
    try {
      const response = await axiosInstance.get('api/user');

      return response?.data;
    } catch {
      return null;
    }
  });

  const deleteDish = async (dishId) => {
    try {
      await axiosInstance.delete(`api/dish/${dishId}`);

      await queryClient.invalidateQueries(['restaurant']);
    } catch (error) {
      console.log(error);
    }
  };

  const submitRating = async () => {
    try {
      if (ratingSet) {
        return;
      }

      await axiosInstance.post('api/rating', {
        rating: selectedRating,
        dish_id: dishId,
      });

      await queryClient.invalidateQueries(['restaurant']);

      setRatingSet(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card className="mb-2">
      <Card.Body>
        <div className="d-flex justify-content-between">
          <div className="d-flex flex-column">
            <h4>{title}</h4>
            <span>{`Price: ${price} €`}</span>
            <span>
              {`Rating: `}
              {rating ? `${rating}/10` : 'there is no rating'}
            </span>
          </div>
          <div>
            {user?.role === 'admin' && (
              <>
                <div className="d-flex gap-2 mb-4">
                  <Button onClick={() => deleteDish(dishId)} variant="danger">
                    Delete
                  </Button>
                  <Link to={`/restaurant/${restaurantId}/dish/${dishId}/edit`}>
                    <Button variant="warning">Edit</Button>
                  </Link>
                </div>
              </>
            )}
            <div>
              {ratingSet ? (
                <span className="my-auto">Thank you! Rating provided.</span>
              ) : (
                <div className="d-flex flex-column gap-3">
                  <span>Rate the dish:</span>
                  <div className="d-flex gap-1">
                    {userRatings.map((userRating) => (
                      <input
                        key={`rating-${userRating}`}
                        readOnly
                        type="radio"
                        value={userRating}
                        checked={userRating <= selectedRating}
                        onClick={() => setSelectedRating(userRating)}
                      />
                    ))}
                  </div>
                  <Button
                    size="sm"
                    onClick={submitRating}
                    disabled={selectedRating === 0}
                    variant={
                      selectedRating === 0
                        ? 'outline-secondary'
                        : 'outline-primary'
                    }
                  >
                    Submit a rating
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default DishListItem;
