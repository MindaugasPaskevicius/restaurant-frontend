import { Breadcrumb, Button, Form } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { axiosInstance } from '../axios';
import { useFormik } from 'formik';
import { number, object, string } from 'yup';
import { useQuery } from 'react-query';

const validationSchema = object({
  title: string().required('The name of the dish is required'),
  price: number()
    .required('The price of the dish is required')
    .moreThan(0, 'The cost of the dish must be greater than 0'),
});

const EditDish = () => {
  const { restaurantId, dishId } = useParams();
  const navigate = useNavigate();

  const { data: dish, isFetched } = useQuery(['dish', dishId], async () => {
    const response = await axiosInstance.get(`/api/dish/${dishId}`);

    return response?.data;
  });

  const initialValues = {
    title: dish?.title ?? '',
    price: dish?.price ?? 0,
  };

  const onSubmit = async (values) => {
    try {
      await axiosInstance.put(`api/dish/${dishId}`, values);

      navigate(`/restaurant/${restaurantId}`);
    } catch (error) {
      console.log(error);
    }
  };

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    isSubmitting,
  } = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit,
  });

  if (!isFetched) {
    return null;
  }

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>
          Restaurants
        </Breadcrumb.Item>
        <Breadcrumb.Item
          linkAs={Link}
          linkProps={{ to: `/restaurant/${restaurantId}` }}
        >
          Restaurant
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Edit dish</Breadcrumb.Item>
      </Breadcrumb>
      <h1>Edit dish</h1>
      <div className="mt-4">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Dish name</Form.Label>
            <Form.Control
              placeholder="Dish name"
              name="title"
              value={values.title}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.title && touched.title && (
              <Form.Text className="text-danger">{errors.title}</Form.Text>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Price, €</Form.Label>
            <Form.Control
              type="number"
              placeholder="Price, €"
              name="price"
              value={values.price}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.price && touched.price && (
              <Form.Text className="text-danger">{errors.price}</Form.Text>
            )}
          </Form.Group>
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            Save
          </Button>
        </Form>
      </div>
    </>
  );
};

export default EditDish;
