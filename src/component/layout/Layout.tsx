import Header from "./Header";
import NavBar from "./NavBar";
import Footer from "./Footer";

const Layout = ({children}: { children: React.ReactNode }) => {
  return (
      <div className="layout-wrapper">
        <Header/>
        <NavBar/>
        <div className="layout-content-wrapper">
          <div className="layout-content">
            {children}
          </div>
        </div>
        <Footer/>
      </div>
  );
};

export default Layout;
