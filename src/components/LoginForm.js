import { useState } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import { object, string } from 'yup';

import { axiosInstance } from '../axios';
import { useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';

const validationSchema = object({
  email: string()
    .email('Invalid email format')
    .required('Email is requared'),
  password: string().required('Password is requared'),
});

const initialValues = {
  email: '',
  password: '',
};

const LoginForm = () => {
  const [submitError, setSubmitError] = useState('');
  const queryClient = useQueryClient();

  const onSubmit = async (values) => {
    try {
      setSubmitError('');

      const result = await axiosInstance.post('api/login', {
        email: values.email,
        password: values.password,
      });

      if (result.data) {
        localStorage.setItem('accessToken', result.data?.accessToken);

        await queryClient.invalidateQueries(['user']);
      }
    } catch (error) {
      setSubmitError(
        'Check your login details and try again!'
      );
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
    <div style={{ width: '300px' }}>
      <h3 className="mb-3">Login</h3>
      {submitError && <Alert variant="danger">{submitError}</Alert>}
      <Form onSubmit={handleSubmit}>
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
        </Form.Group>
        <div className="d-flex justify-content-between align-items-center">
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            Login
          </Button>
          <Link to="/register">Create account</Link>
        </div>
      </Form>
    </div>
  );
};

export default LoginForm;
