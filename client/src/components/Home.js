import Header from "./Header";
import Footer from "./Footer";

const Home = () => {
  return (
    <>
      <Header />
      <main>
        <h2>
         Hi and welcome.
        </h2>
        <p className="about-content">This place houses the writings and processes of Tim Taylor as he contemplates technology, design, process, and the connection of those things to the human experience. Always a beginner; forever a work in progress.</p>
      </main>
      <Footer />
    </>
  );
};

export default Home;
