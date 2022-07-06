import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ active, children }) {
  return (
    <>
      <Header active={active} />
      {children}
      <Footer />
    </>
  );
}
