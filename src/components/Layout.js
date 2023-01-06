import Header from './Header';
import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';

const Layout = () => {
  return (
    <div
      className="d-flex flex-column vh-100"
      style={{ backgroundColor: '#efefef' }}
    >
      <Header />
      <Container className="d-flex flex-column flex-fill py-5">
        <Outlet />
      </Container>
    </div>
  );
};

export default Layout;
