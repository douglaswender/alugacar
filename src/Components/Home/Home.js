import React, { Component } from 'react'

import firebase from '../../Services/Firebase'

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
        this.renderCarros = this.renderCarros.bind(this);
        this.state = {
            isLoading: true,
            isAdmin: false,
            nome: '',
            email: '',
            usuarioAuth: [],
            usuarioFire: {},
            carrosAlugados: [],
        }
        this.getUsuario()
    }

    logout() {
        firebase.auth().signOut();
    }

    componentDidMount() {
        this.setState({ isLoading: true });
        this.getUsuario();
        console.log(this.state)
    }

    async getCarrosAdmin() {
        var carros = [];
        var idUsr = await this.state.usuarioFire.id;
        console.log('idUsr: ', idUsr);
        if (idUsr != null) {
            const carrosRef = firebase.firestore().collection('carros');
            carrosRef.where('alugado', '==', true)
                .get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        let id = doc.id;
                        let data = doc.data();
                        var carroVal = {
                            'id': id,
                            'data': data,
                        }
                        carros.push(carroVal);
                    });
                    this.setState({
                        carrosAlugados: carros,
                        isLoading: false
                    });
                });
        }

    }

    async getCarrosByUsuario() {
        var carros = [];
        var idUsr = await this.state.usuarioFire.id;
        console.log('idUsr: ', idUsr);
        if (idUsr != null) {
            const carrosRef = firebase.firestore().collection('carros');
            carrosRef.where('idUsuario', '==', idUsr).where('alugado', '==', true)
                .get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        let id = doc.id;
                        let data = doc.data();
                        var carroVal = {
                            'id': id,
                            'data': data,
                        }
                        carros.push(carroVal);
                    });
                    this.setState({
                        carrosAlugados: carros,
                        isLoading: false
                    });
                });
        }

    }

    async getUsuario() {
        var user;
        await firebase.firestore().collection("usuarios").get().then(doc => {
            user = firebase.auth().currentUser;
            this.setState({ usuarioAuth: user });
            console.log(this.state);
            if (user != null) {
                var userData;
                firebase.firestore().collection('usuarios').where("email", "==", user.email).get().then(snapshot => {
                    snapshot.forEach(doc => {
                        let id = doc.id;
                        let data = doc.data();
                        var usrVal = {
                            'id': id,
                            'data': data
                        }
                        console.log(usrVal.id, '==>', usrVal.data)
                        userData = usrVal;
                    })
                    this.setState({ usuarioFire: userData });
                    if(this.state.usuarioFire.data.admin){
                        this.getCarrosAdmin();
                    }else{
                        this.getCarrosByUsuario();
                    }
                });
            }
        });

    }

    cancelaCarro(carroId) {
        var today = new Date();
        var dia, mes, ano;
        ano = today.getFullYear();
        if (ano < 10) {
            ano = "0" + ano;
        }
        mes = today.getMonth() + 1;
        if (mes < 10) {
            mes = "0" + mes;
        }
        dia = today.getDate();
        var finalDate = dia + "/" + mes + "/" + ano;
        console.log("Você cancelou a reserva do carro: ", carroId)
        let carroRef = firebase.firestore().collection('carros').doc(carroId);
        carroRef.update({
            alugado: false,
            dataLiberado: finalDate
        }).then(() => {
            window.location = "/";
        });
    }

    renderWelcome() {
        return (
            <div className="row justify-content-between">
                {this.state.isLoading}
                <div className="col-auto">
                    <h2>Olá {this.state.usuarioFire.data.nome} !</h2>
                </div>
                <div className="col-auto">
                    <button onClick={this.logout} className="btn btn-danger th-small-width button-logout">Logout</button>
                </div>
            </div>);

    }

    renderCarros(carro) {
        console.log(carro.id, '->', carro.data);
        return (
            <tr key={carro.id}>
                <td>{carro.data.modelo}</td>
                <td>{carro.data.marca}</td>
                <td>{carro.data.cor}</td>
                <td><button className="btn btn-danger" onClick={() => this.cancelaCarro(carro.id)}>Cancelar</button></td>
            </tr>
        );
    }

    renderCarrosAlugados() {
        return (
            <div>
                <h3>Seus carros alugados:</h3>
                <table className="table">
                    <thead>
                        <th className="th-small-width">Modelo</th>
                        <th className="th-big-width">Marca</th>
                        <th className="th-small-width">Cor</th>
                        <th className="th-small-width"></th>
                    </thead>
                    <tbody>
                        {this.state.carrosAlugados.map(this.renderCarros)}
                    </tbody>
                </table>
            </div>
        )
    }

    render() {
        if (this.state.isLoading) {
            return (
                <div className="container">
                    Carregando...
                </div>
            )
        } else {
            if (this.state.usuarioFire.data.admin) {
                return (
                    <div className="container">
                        {this.renderWelcome()}
                        {this.renderCarrosAlugados()}
                    </div>
                )
            } else {
                return (
                    <div className="container">
                        {this.renderWelcome()}
                        {this.renderCarrosAlugados()}

                    </div>
                )
            }
        }

    }
}
