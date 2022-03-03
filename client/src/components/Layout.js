import Header from './Header';
import Footer from './Footer';


const Layout = (props) => (
  <>
    <Header active={props.active} />
      {props.children}
    <Footer />
  </>
)

export default Layout
