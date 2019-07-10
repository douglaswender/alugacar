import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router, Route } from 'react-router-dom';


import App from './Components/App/App';
import Header from './Components/Header/Header'
import Carros from './Components/Carros/Carros'
import Carro from './Components/Carros/Carro/Carro';

ReactDOM.render(
    <Router>
    <div className="container">
      <Header />
      <Route exact path='/' component={App} />
      <Route exact path='/carros' component={Carros} />
      <Route exact path='/carros/:id' component={Carro} />
       {/* <Route exact path='/medicos/:id' component={Medico} />
       <Route exact path='/medicos/agendar/:idMedico/:idHorario' component={Agendar} />
       <Route path='/agenda' component={Agenda} />
       <Route path='/perfil' component={Perfil} /> */}
    </div>
  </Router>, document.getElementById('root'));
serviceWorker.unregister();
