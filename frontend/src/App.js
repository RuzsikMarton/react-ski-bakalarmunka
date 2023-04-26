import {BrowserRouter, Link, Route, Routes} from 'react-router-dom';
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import ProductScreen from "./oldalak/ProductScreen";
import {Badge, Button, Col, Container, Nav, Navbar, NavDropdown} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";
import SigninScreen from "./oldalak/SigninScreen";
import {useContext} from "react";
import {Store} from "./Store";
import CartScreen from "./oldalak/CartScreen";
import ShippingAdressScreen from "./oldalak/ShippingAdressScreen";
import SignupScreen from "./oldalak/SignupScreen";
import PaymentMethodScreen from "./oldalak/PaymentMethodScreen";
import PlaceOrderScreen from "./oldalak/PlaceOrderSceen";
import SkiPassScreen from "./oldalak/SkiPassScreen";
import OrderScreen from "./oldalak/OrderScreen";
import OrderHistoryScreen from "./oldalak/OrderHistoryScreen";
import ProfileScreen from "./oldalak/ProfileScreen";
import SearchScreen from "./oldalak/SearchScreen";
import ProtectedRoutes from "./komponensek/ProtectedRoutes";
import DashboardScreen from "./oldalak/DashboardScreen";
import AdminRoutes from "./komponensek/AdminRoutes";
import ProductListScreen from "./oldalak/ProductListScreen";
import ProductEditScreen from "./oldalak/ProductEditScreen";
import OrderListScreen from "./oldalak/OrderListScreen";
import UserListScreen from "./oldalak/UserListScreen";
import UserEditScreen from "./oldalak/UserEditScreen";
import InfoScreen from "./oldalak/InfoScreen";
import WeatherListScreen from "./oldalak/WeatherListScreen";
import WeatherEditScreen from "./oldalak/WeatherEditScreen";
import WeatherScreen from "./oldalak/WeatherScreen";
import AccomodationScreen from "./oldalak/AccomodationScreen";

function App() {
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { cart, userInfo } = state;

    const signoutHandler = () => {
        ctxDispatch({ type: 'USER_SIGNOUT' });
        localStorage.removeItem('userInfo');
        localStorage.removeItem('shippingAddress');
        localStorage.removeItem('paymentMethod');
        window.location.href = '/signin';
    };

  return (
      <BrowserRouter>
          <div className="d-flex flex-column site-container">
              <ToastContainer position={"bottom-center"} limit={1}></ToastContainer>
            <Navbar className={"navbar-custom"} expand={'lg'}>
              <Col md={2} ></Col>
              <Col md={7}>
                  <Navbar.Toggle aria-controls="basic-navbar-nav" className={"customtoggle"}> </Navbar.Toggle>
                  <Navbar.Collapse id="basic-navbar-nav">
                      <LinkContainer to="/">
                        <Navbar.Brand>Főoldal</Navbar.Brand>
                      </LinkContainer>
                      <LinkContainer to="/weather">
                        <Navbar.Brand>Időjárás</Navbar.Brand>
                      </LinkContainer>
                      <LinkContainer to="/skipass">
                        <Navbar.Brand>Skipass</Navbar.Brand>
                      </LinkContainer>
                      <LinkContainer to="/search">
                        <Navbar.Brand>Kölcsönzés</Navbar.Brand>
                      </LinkContainer>
                      <LinkContainer to="/accomodation">
                          <Navbar.Brand>Szállás</Navbar.Brand>
                      </LinkContainer>
                  </Navbar.Collapse>
              </Col>
                <Col md={1}>
                    <Nav className={"me-auto"}>
                        <Link to="/kosar" className={"nav-link"}>
                            <div className={"kosar-szin"}>
                                <span><i className="fas fa-shopping-cart"></i></span>
                                {cart.cartItems.length > 0 &&
                                    <Badge pill bg={"danger"}>
                                        {cart.cartItems.reduce((a,c) => a+c.quantity,0)}
                                    </Badge>}
                            </div>
                        </Link>
                    </Nav>

                </Col>
                    {userInfo ? (
                        <Col md={1}>
                        <NavDropdown title={userInfo.name} id={"basic-nav-dropdown"}>
                            <LinkContainer to={"/profile"}>
                                <NavDropdown.Item>Profil</NavDropdown.Item>
                            </LinkContainer>
                            <LinkContainer to={"/orderhistory"}>
                                <NavDropdown.Item>Vásárlási előzmények</NavDropdown.Item>
                            </LinkContainer>
                            <NavDropdown.Divider></NavDropdown.Divider>
                            <Link className={'dropdown-item'} to={"#signout"} onClick={signoutHandler}>Kijelentkezés</Link>
                        </NavDropdown>
                        </Col>
                    ) : (
                        <Col md={2}>
                                <LinkContainer to={"/signin"}><Button variant={"primary"}>Bejelentkezés</Button></LinkContainer> {' '}
                                <LinkContainer to={"/signup"}><Button variant={"primary"}>Regisztráció</Button></LinkContainer>
                        </Col>
                    )}
                {userInfo && userInfo.isAdmin && (
                    <Col md={1}>
                    <NavDropdown title={"Admin"} id={"admin-nav-dropdown"}>
                        <LinkContainer to={"/admin/dashboard"}>
                            <NavDropdown.Item>Irányítópult</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to={"/admin/products"}>
                            <NavDropdown.Item>Terméklista</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to={"/admin/orders"}>
                            <NavDropdown.Item>Rendelés lista</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to={"/admin/users"}>
                            <NavDropdown.Item>Felhasználó lista</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to={"/admin/weathers"}>
                            <NavDropdown.Item>Weather</NavDropdown.Item>
                        </LinkContainer>
                    </NavDropdown>
                    </Col>
                )}
            </Navbar>
      <main>
        <Routes>
          <Route path={'/weather'} element={<WeatherScreen></WeatherScreen>}></Route>
            <Route path={'/search'} element={<SearchScreen></SearchScreen>}></Route>
            <Route path={'/'} element={<InfoScreen userInfo={userInfo}></InfoScreen>}></Route>
        </Routes>
      <Container>
        <Routes>
            <Route path={'/skipass'} element={<SkiPassScreen></SkiPassScreen>}></Route>
          <Route path={'/kolcsonzo/:slug'} element={<ProductScreen></ProductScreen>}></Route>
            <Route path={'/kosar'} element={<CartScreen></CartScreen>}></Route>
            <Route path={'/signin'} element={<SigninScreen></SigninScreen>}></Route>
            <Route path={'/signup'} element={<SignupScreen></SignupScreen>}></Route>
            <Route path={'/accomodation'} element={<AccomodationScreen></AccomodationScreen>}></Route>
            <Route path={'/shipping'} element={<ShippingAdressScreen></ShippingAdressScreen>}></Route>
            <Route path={'/payment'} element={<PaymentMethodScreen></PaymentMethodScreen>}></Route>
            <Route path={'/placeorder'} element={<PlaceOrderScreen></PlaceOrderScreen>}></Route>
            <Route path={'/order/:id'} element={<ProtectedRoutes><OrderScreen></OrderScreen></ProtectedRoutes>}></Route>
            <Route path={'/orderhistory'} element={<ProtectedRoutes><OrderHistoryScreen></OrderHistoryScreen></ProtectedRoutes>}></Route>
            <Route path={'/profile'} element={<ProtectedRoutes><ProfileScreen></ProfileScreen></ProtectedRoutes>}></Route>
            {/*Admin Routes*/}
            <Route path={"/admin/dashboard"} element={<AdminRoutes><DashboardScreen></DashboardScreen></AdminRoutes>}></Route>
            <Route path={"/admin/products"} element={<AdminRoutes><ProductListScreen></ProductListScreen></AdminRoutes>}></Route>
            <Route path={"/admin/product/:id"} element={<AdminRoutes><ProductEditScreen></ProductEditScreen></AdminRoutes>}></Route>
            <Route path={"/admin/orders"} element={<AdminRoutes><OrderListScreen></OrderListScreen></AdminRoutes>}></Route>
            <Route path={"/admin/users"} element={<AdminRoutes><UserListScreen></UserListScreen></AdminRoutes>}></Route>
            <Route path={"/admin/user/:id"} element={<AdminRoutes><UserEditScreen></UserEditScreen></AdminRoutes>}></Route>
            <Route path={"/admin/weathers"} element={<AdminRoutes><WeatherListScreen></WeatherListScreen></AdminRoutes>}></Route>
            <Route path={"/admin/weathers/:id"} element={<AdminRoutes><WeatherEditScreen></WeatherEditScreen></AdminRoutes>}></Route>
        </Routes>
        </Container>
      </main>
        <footer className="text-center">© 2023 | Ruzsik Márton László</footer>
    </div>
      </BrowserRouter>
  );
}

export default App;
