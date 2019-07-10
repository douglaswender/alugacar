import React, { Component } from 'react'
import firebase from '../../Services/Firebase';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.login = this.login.bind(this);
        this.signup = this.signup.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            email: '',
            password: '',
            nome: '',
            telefone: '',
            error: false,
            signup: '',
        };
    }

    login(e) {
        e.preventDefault();
        if (this.state.signup) {
            this.setState({ signup: false });

        }
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((u) => {
        }).catch((error) => {
            console.log(error);
            this.setState({ error: true });
        })
    }

    signup(e) {
        e.preventDefault();
        if (this.state.signup) {
            if (this.state.nome !== "" && this.state.telefone !== "") {
                firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then(
                    firebase.firestore().collection('usuarios').doc().set({
                        email: this.state.email,
                        senha: this.state.password,
                        nome: this.state.nome,
                        telefone: this.state.telefone,
                        admin: false,
                    }).then()).catch((error) => {
                        console.log(error);
                        this.setState({ error: true });
                    })


            } else {
                this.setState({ error: true })
            }
        } else {
            this.setState({ signup: true });
        }
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
            let small, div1, div2;
        if (this.state.error) {
            small = <small>Email ou senha inválidos!<br /></small>
        } else {
            small = <br />
        }

        if (this.state.signup) {
            div1 = <div className="form-group">
                <label htmlFor="">Nome</label>
                <input type="text" name="nome" id="nome" value={this.state.nome} onChange={this.handleChange} className="form-control login-width" placeholder="Nome..." required />
            </div>
            div2 = <div className="form-group">
                <label htmlFor="">Telefone</label>
                <input type="text" name="telefone" id="telefone" data-mask="(00) 0 0000-0000" value={this.state.telefone} onChange={this.handleChange} className="form-control login-width" placeholder="Telefone..." required />
            </div>
        }

        return (
            <div className="row">
                <div className="col-sm-4">

                </div>
                <div className="col-sm-4 styled-div">
                    <form action="" className="styled-form">
                        <div className="form-group">
                            <label htmlFor="">Email</label>
                            <input type="email" name="email" id="email" value={this.state.email} onChange={this.handleChange} className="form-control login-width" placeholder="Email..." required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="">Senha</label>
                            <input type="password" name="password" id="password" value={this.state.password} onChange={this.handleChange} className="form-control login-width" placeholder="Senha..." required />

                        </div>
                        {div1}
                        {div2}
                        {small}

                        <button type="submit" className="btn btn-primary button-form" onClick={this.login} >Login</button>
                        <hr className="hr"/>
                        <button className="btn btn-secondary button-form" onClick={this.signup}>Cadastrar-se</button>

                    </form>
                </div>
                <div className="col-sm-4">

                </div>
            </div>

        )
    }
}
