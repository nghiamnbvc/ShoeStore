import {
  BrowserRouter as Router,
  Route,
  Switch,
  useLocation,
} from "react-router-dom";
import Nav from "./components/Nav";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./page/HomePage/HomeComponent/Home";
import ProductMen from "./page/ProductPage/ProductComponent/ProductMen";
import ProductWomen from "./page/ProductPage/ProductComponent/ProductWomen";
import Sales from "./page/SalesPage/SalesComponent/Sales";
import Search from "./page/SearchPage/SearchComponent/Search";
import NewArrival from "./page/NewArrival/NewArrivalComponent/NewArrival";
import ProductDetail from "./page/ProductDetailPage/ProductDetailComponent/ProductDetail";
import Cart from "./page/CartPage/CartComponent/Cart";
import Login from "./page/AuthPage/Login";
import Register from "./page/AuthPage/Register";
import PrivateRoute from "./components/PrivateRoute";
import Favourite from "./page/FavouritePage/FavouriteComponent/Favourite";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Checkout from "./page/CheckoutPage/CheckoutComponent/Checkout";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const AppContent = () => {
  const location = useLocation();
  const hideNavPaths = ["/login", "/register", "/checkout"];
  const shouldHideNav = hideNavPaths.includes(location.pathname);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <ScrollToTop />
      {!shouldHideNav && <Nav />}
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/men">
          <ProductMen />
        </Route>
        <Route path="/women">
          <ProductWomen />
        </Route>
        <Route path="/sales">
          <Sales />
        </Route>
        <Route path="/search">
          <Search />
        </Route>
        <Route path="/newarrival">
          <NewArrival />
        </Route>
        <Route path="/productdetail/:id">
          <ProductDetail />
        </Route>
        <PrivateRoute path="/cart" component={Cart} />
        <Route path="/checkout">
          <Checkout />
        </Route>
        <Route path="/favourite">
          <Favourite />
        </Route>
      </Switch>
    </>
  );
};

// ✅ App chính được bọc bằng Router
const App = () => {
  const clientId =
    "Abf6qmNwoffdDxhulKIlFaFgvDuUTnI2jtj9hF0cntPfvbg3KmLx1khNglgY4bA0Wv2XtNzoZR3cPoNB";

  return (
    <PayPalScriptProvider options={{ "client-id": clientId }}>
      <Router>
        <AppContent />
      </Router>
    </PayPalScriptProvider>
  );
};

export default App;
