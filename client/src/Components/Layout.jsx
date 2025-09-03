// Layout.jsx
import { useLocation } from 'react-router-dom';
import { Footer } from './footer.jsx';



const Layout = ({ children }) => {
  const location = useLocation();
  const visiblePaths = ['/', '/about'];
  const showFooter = visiblePaths.includes(location.pathname);

  return (
    <>
    
      {children}
      {showFooter && <Footer />}
    </>
  );
};

export default Layout;
