import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Img from '../../Assets/Images/logo.png';

export default class Header extends Component {
    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-light">
                    <a className="navbar-brand" href="/">
                        <img src={Img} height="30" alt="logo.jpg" />
                    </a>

                    <div className="collapse navbar-collapse">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item">
                                <Link to="/" className="nav-link">Principal</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/carros" className="nav-link">Carros</Link>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>

        )
    }
}
