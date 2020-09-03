import React, {useEffect, useState} from 'react';
import { Router} from 'react-router-dom';
import {renderRoutes} from 'react-router-config';
import {createBrowserHistory} from 'history';
import MomentUtils from '@date-io/moment';
import {useDispatch} from 'react-redux';
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import 'react-perfect-scrollbar/dist/css/styles.css';
import routes from './routes';
import ScrollReset from './components/ScrollReset';
import './mixins/chartjs';
import './mixins/moment';
import './mixins/validate';
import './mixins/prismjs';
import './mock';
import './assets/scss/main.scss';
import {authCheckState} from "./actions";
import {Dispatch} from "redux";


const history = createBrowserHistory();

function App() {
  const dispatch: Dispatch = useDispatch();
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    dispatch(authCheckState());
    if (!token) {
      history.push('/auth/login');
    }
  }, []);

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      {/*<HashRouter history={history}>*/}
      <Router history={history}>
        <ScrollReset/>
        {renderRoutes(routes)}
      </Router>
      {/*</HashRouter>*/}
    </MuiPickersUtilsProvider>
  );
}

export default App;
