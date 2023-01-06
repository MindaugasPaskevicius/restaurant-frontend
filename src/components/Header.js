import { Container, Nav, Navbar } from 'react-bootstrap';
import { useQuery, useQueryClient } from 'react-query';
import { axiosInstance } from '../axios';
import { Link } from 'react-router-dom';

const Header = () => {
  const queryClient = useQueryClient();

  const { data: user } = useQuery(['user'], async () => {
    try {
      const response = await axiosInstance.get('api/user');

      return response?.data;
    } catch {
      return null;
    }
  });

  const handleLogout = async () => {
    localStorage.removeItem('accessToken');

    await queryClient.invalidateQueries(['user']);
  };

  return (
    <Navbar bg="dark" expand="lg" className="navbar-dark">
      <Container>
        <Navbar.Brand>Restaurant application</Navbar.Brand>
        {user && (
          <>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/">
                  Restaurant List
                </Nav.Link>
              </Nav>
              <Nav>
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </>
        )}
      </Container>
    </Navbar>
  );
};

export default Header;
