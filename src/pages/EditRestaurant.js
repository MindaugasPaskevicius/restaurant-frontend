import { Breadcrumb, Button, Form } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { axiosInstance } from '../axios';
import { useFormik } from 'formik';
import { object, string } from 'yup';
import { useQuery } from 'react-query';

const validationSchema = object({
  title: string().required('The name of the restaurant is required'),
  city: string().required('City is required'),
  address: string().required('Address is required'),
  hours: string().required('Working hours is required'),
});

const EditRestaurant = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: restaurant, isFetched } = useQuery(
    ['restaurant', id],
    async () => {
      const response = await axiosInstance.get(`/api/restourant/${id}`);

      return response?.data;
    }
  );

  const initialValues = {
    title: restaurant?.title ?? '',
    city: restaurant?.city ?? '',
    address: restaurant?.address ?? '',
    hours: restaurant?.hours ?? '',
  };

  const onSubmit = async (values) => {
    try {
      await axiosInstance.put(`api/restourant/${id}`, values);

      navigate('/');
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
          Restaurant
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Edit restaurant</Breadcrumb.Item>
      </Breadcrumb>
      <h1>Edit restaurant</h1>
      <div className="mt-4">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              placeholder="Name"
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
            <Form.Label>City</Form.Label>
            <Form.Control
              placeholder="City"
              name="city"
              value={values.city}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.city && touched.city && (
              <Form.Text className="text-danger">{errors.city}</Form.Text>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control
              placeholder="Address"
              name="address"
              value={values.address}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.address && touched.address && (
              <Form.Text className="text-danger">{errors.address}</Form.Text>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Working hours</Form.Label>
            <Form.Control
              placeholder="Working hours"
              name="hours"
              value={values.hours}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.hours && touched.hours && (
              <Form.Text className="text-danger">{errors.hours}</Form.Text>
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

export default EditRestaurant;
