import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../services/apiServices';
import { toast } from 'react-toastify';
import { doLogout } from '../../redux/action/userAction';
import Language from './Languge';
import logoz from '../../assets/logoquiz.svg';

const Header = () => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const account = useSelector((state) => state.user.account);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  ///

  //
  const handleLogin = () => {
    navigate('/login');
  };
  const handleRegister = () => {
    navigate('/register');
  };
  const handleLogOut = async () => {
    let rs = await logout(account.email, account.refresh_token);
    if (rs && rs.EC === 0) {
      //clear data redux
      dispatch(doLogout());
      navigate('/');
    } else {
      toast.error(rs.EM);
    }
  };
  const openAdminTab = (e) => {
    e.preventDefault(); // Ngăn không cho NavLink thực hiện chuyển hướng theo mặc định

    // Kiểm tra vai trò của tài khoản
    if (account.role === 'ADMIN') {
      window.open('/admins', '_blank'); // Mở tab mới nếu là ADMIN
    } else {
      toast.error('404 Error: You do not have permission to access this page.'); // Hiển thị thông báo lỗi
    }
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <NavLink to={`/`} className="navbar-brand">
          <img
            src={logoz}
            alt="Logo"
            style={{
              height: '85px',
              filter: 'invert(25%) sepia(100%) saturate(1000%) hue-rotate(215deg)',
            }}
            className="logoZ"
          />{' '}
        </NavLink>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavLink to={`/`} className="nav-link">
              Home
            </NavLink>
            <NavLink to={`/quizzes`} className="nav-link">
              Quizzes
            </NavLink>
            {/* {isAuthenticated &&
              account.role === 'ADMIN' && ( // Chỉ hiển thị khi vai trò là ADMIN */}
            <NavLink to={`/admins`} className="nav-link" onClick={openAdminTab}>
              Admin
            </NavLink>

            {/* <NavLink to={`/admins`} className="nav-link" onClick={openAdminTab}>
              Admin
            </NavLink> */}
          </Nav>
          <Nav>
            {isAuthenticated === false ? (
              <>
                <button className="btn-login" onClick={() => handleLogin()}>
                  Log in
                </button>
                <button className="btn-signup" onClick={() => handleRegister()}>
                  Sign up
                </button>
              </>
            ) : (
              <NavDropdown title="Settings" id="basic-nav-dropdown">
                <NavDropdown.Item>Profile</NavDropdown.Item>
                <NavDropdown.Item onClick={() => handleLogOut()}>Log out</NavDropdown.Item>
              </NavDropdown>
            )}
            <Language></Language>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
