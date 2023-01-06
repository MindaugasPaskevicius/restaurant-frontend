import { Alert, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { useState } from 'react';
import { object, ref, string } from 'yup';
import { axiosInstance } from '../axios';
import { useFormik } from 'formik';

const validationSchema = object({
  name: string().required('Name is required'),
  email: string()
    .email('Invalid email format')
    .required('Email is required'),
  password: string().required('Password is requered'),
  repeatPassword: string().oneOf(
    [ref('password'), null],
    'Passwords must match'
  ),
});

const initialValues = {
  name: '',
  email: '',
  password: '',
  repeatPassword: '',
};

const RegisterForm = () => {
  const [submitError, setSubmitError] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  const onSubmit = async (values) => {
    try {
      setSubmitError('');

      await axiosInstance.post('api/register', {
        name: values.name,
        email: values.email,
        password: values.password,
      });

      setIsCompleted(true);
    } catch (error) {
      if (error.response.status === 400) {
        setSubmitError('Such a user already exists.');
      } else {
        setSubmitError('Error occurred!');
      }
    }
  };

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema,
      onSubmit,
    });

  if (isCompleted) {
    return (
      <div className="d-flex flex-column text-center gap-4">
        <span>Registration is successful, you can now log in</span>
        <Link to="/login">
          <Button>Go to login</Button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ width: '300px' }}>
      <h3 className="mb-3">Registration</h3>
      {submitError && <Alert variant="danger">{submitError}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="name"
            placeholder="Name"
            name="name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.name && touched.name && (
            <Form.Text className="text-danger">{errors.name}</Form.Text>
          )}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Email"
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.email && touched.email && (
            <Form.Text className="text-danger">{errors.email}</Form.Text>
          )}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.password && touched.password && (
            <Form.Text className="text-danger">{errors.password}</Form.Text>
          )}
        </Form.Group>{' '}
        <Form.Group className="mb-3">
          <Form.Label>Repeat the password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Repeat the password"
            name="repeatPassword"
            value={values.repeatPassword}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.repeatPassword && touched.repeatPassword && (
            <Form.Text className="text-danger">
              {errors.repeatPassword}
            </Form.Text>
          )}
        </Form.Group>
        <div className="d-flex justify-content-between align-items-center">
          <Button variant="primary" type="submit">
          Register
          </Button>
          <Link to="/login">I already have an account</Link>
        </div>
      </Form>
    </div>
  );
};

export default RegisterForm;
