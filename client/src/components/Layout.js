import Header from "./Header";
import Footer from "./Footer";

const Layout = ({active, children}) => (
  <>
    {/* if using <NavLink> can remove active props passing */}
    <Header active={active} />
    {/* should wrap children in <main> here so it can be removed from individual pages */}
    {children}
    <Footer />
  </>
);

export default Layout;
