import { Breadcrumb, Button, Form } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { number, object, string } from 'yup';
import { useFormik } from 'formik';
import { axiosInstance } from '../axios';

const validationSchema = object({
  title: string().required('The name of the dish is required'),
  price: number()
    .required('The price of dish is required')
    .moreThan(0, 'The cost of the dish must be greater than 0'),
});

const initialValues = {
  title: '',
  price: 0,
};

const CreateDish = () => {
  const { id: restaurantId } = useParams();
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    try {
      await axiosInstance.post(`api/dish`, {
        ...values,
        restourant_id: restaurantId,
      });

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
    onSubmit,
  });

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
        <Breadcrumb.Item active>Add dish</Breadcrumb.Item>
      </Breadcrumb>
      <h1>Add dish</h1>
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

export default CreateDish;
