import React, { useEffect, useState } from 'react'
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Login from './components/Login'
import Signup from './components/Signup'
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import AddVendor from './components/AddVendor';
import AddProduct from './components/AddProduct';
import ProfileVendor from './components/ProfileVendor';
import ProfileProduct from './components/ProfileProduct';
import Panier from './components/Panier';
import Profile from './components/Profile';
import UpdateProduct from './components/UpdateProduct';



const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));



function App() {

  const classes = useStyles();
  const [user, setUser] = useState(null)
  // une fois que le composant est chargé cette fonction se lance
  useEffect(() => {
    // cette fonction vérifie si l'utilisateur est réellement connecté
    // c'est à dire si l'objet utilisateur est stocké dans le localstorage
    const u = localStorage.getItem('user');
    if (u) {
      setUser(JSON.parse(u))
    }
  }, [])

  return (
    <div className="App">
      <Router>
        <div>
          <Header />
          {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <Route path="/dashboard" component={Dashboard} />
            {user && user.admin ? <Route path="/addvendor" component={AddVendor} /> : null}
            {user && user.admin ? <Route path="/addproduct" component={AddProduct} /> : null}
            <Route path="/profile-vendor/:vendor_id" component={ProfileVendor} />
            <Route path="/profile-product/:product_id" component={ProfileProduct} />
            <Route path="/update-product/:product_id" component={UpdateProduct} />

            <Route path="/panier" component={Panier} />
            <Route path="/profile" component={Profile} />
            <Route path="/" component={Dashboard} />

          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
