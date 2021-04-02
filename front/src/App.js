import logo from './logo.svg';
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
            <Route path="/addvendor" component={AddVendor} />
            <Route path="/addproduct" component={AddProduct} />
            <Route path="/profile-vendor/:vendor_id" component={ProfileVendor} />

            <Route path="/" component={Dashboard} />

          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
