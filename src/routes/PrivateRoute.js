import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivateRoute = (props) => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const userRole = useSelector((state) => state.user.account?.role); // Lấy role người dùng

  if (!isAuthenticated) {
    // Nếu chưa đăng nhập, chuyển hướng tới trang login
    return <Navigate to="/login" replace />;
  }

  // Kiểm tra xem người dùng có quyền Admin hay không
  if (props.requireAdmin && userRole !== 'ADMIN') {
    // Nếu không phải Admin, chuyển hướng về trang 404 hoặc trang khác
    return <Navigate to="/404" replace />;
  }

  return <>{props.children}</>;
};

export default PrivateRoute;
