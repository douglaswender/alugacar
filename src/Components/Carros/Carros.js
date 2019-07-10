import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import firebase from '../../Services/Firebase';

export default class Carros extends Component {
    constructor(props) {
        super(props);
        this.renderCarros = this.renderCarros.bind(this);

        this.state = {
            loading: false,
            isAdmin: false,
            email: '',
            data: [],
            usrData: [],
            perfil: [],
            usuarioFire: []
        }
    }
    componentDidMount() {
        this.setState({ loading: true })
        this.getUsuario();
    }

    getUsuario() {
        var user;
        firebase.firestore().collection("usuarios").get().then(doc => {
            user = firebase.auth().currentUser;
            this.setState({ usuarioAuth: user });
            console.log(this.state);
            if (user != null) {
                var perfil;
                firebase.firestore().collection('usuarios').where("email", "==", user.email).get().then(snapshot => {
                    snapshot.forEach(doc => {
                        let id = doc.id;
                        let data = doc.data();
                        var perfilVal = {
                            'id': id,
                            'data': data
                        }
                        perfil = perfilVal;
                    });
                    console.log(perfil.data.admin);
                    if (perfil.data.admin) {
                        this.setState({
                            usrData: perfil,
                            isAdmin: true
                        });
                        this.getCarrosDisponiveisAdmin();
                    } else {
                        this.setState({
                            usrData: perfil,
                            isAdmin: false,
                        });
                        this.getCarrosDisponiveis();
                    }

                });
            }
        });
    }

    getCarrosDisponiveis() {
        console.log("É USUÁRIO");
        
        var carros = [];
        const carrosRef = firebase.firestore().collection('carros');
        carrosRef.orderBy('alugado').orderBy('dataLiberado').where('visivel', '==', true).get().then((snapshot) => {
            snapshot.forEach(doc => {
                let id = doc.id;
                let data = doc.data();
                var carroVal = {
                    'id': id,
                    'data': data
                }
                carros.push(carroVal);
            });
            this.setState({
                data: carros,
                loading: false,
            })
        }
        );
    }

    getCarrosDisponiveisAdmin() {
        console.log("É ADMIN!");
        
        var carros = [];
        const carrosRef = firebase.firestore().collection('carros');
        carrosRef.orderBy('alugado').orderBy('dataLiberado').get().then((snapshot) => {
            snapshot.forEach(doc => {
                let id = doc.id;
                let data = doc.data();
                var carroVal = {
                    'id': id,
                    'data': data
                }
                carros.push(carroVal);
            });
            this.setState({
                data: carros,
                loading: false,
            })
        }
        );
    }

    alugaCarro(carroId) {
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
        dia = today.getDate() + 7;
        var finalDate = dia + "/" + mes + "/" + ano;
        console.log("Você reservou o carro: ", carroId)
        let carroRef = firebase.firestore().collection('carros').doc(carroId);
        carroRef.update({
            alugado: true,
            dataLiberado: finalDate,
            idUsuario: this.state.usrData.id
        }).then(() => {
            window.location = "/carros";
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
            window.location = "/carros";
        });
    }

    renderCarrosAdmin(carro) {
        if (carro.data.idUsuario === this.state.usrData.id) {
            return (<tr key={carro.id}>
                <td>{carro.data.modelo}</td>
                <td>{carro.data.marca}</td>
                <td>{carro.data.cor}</td>
                <td>{carro.data.preco}</td>
                {carro.data.alugado ?
                    <td>{carro.data.dataLiberado}</td>
                    :
                    <td>Sim</td>
                }
                {carro.data.alugado ?
                    (<td><button onClick={() => { this.cancelaCarro(carro.id) }} className="btn btn-danger btn-default-width" >Cancelar</button></td>)
                    :
                    (<td><button onClick={() => { this.alugaCarro(carro.id) }} className="btn btn-primary btn-default-width" >Alugar</button></td>)
                }

            </tr>)
        } else {
            
            return (
                <tr key={carro.id}>
                    <td className="th-big-width">{carro.data.modelo}</td>
                    <td className="th-big-width">{carro.data.marca}</td>
                    <td className="th-small-width">{carro.data.cor}</td>
                    <td className="th-small-width">{carro.data.preco}</td>
                    {carro.data.alugado ?
                        <td className="th-small-width">{carro.data.dataLiberado}</td>
                        :
                        <td className="th-small-width">Sim</td>
                    }
                    {carro.data.alugado ?
                        (<td className="th-small-width"><button onClick={() => { }} className="btn btn-secondary btn-default-width" disabled >Alugado</button></td>)
                        :
                        (<td className="th-small-width"><button onClick={() => { this.alugaCarro(carro.id) }} className="btn btn-primary btn-default-width" >Alugar</button></td>)
                    }

                </tr>
            )
        }
    }


    renderCarros(carro) {
        if (this.state.isAdmin) {
            return (
                <tr key={carro.id}>
                    <td>{carro.data.modelo}</td>
                    <td>{carro.data.marca}</td>
                    <td>{carro.data.cor}</td>
                    <td>{carro.data.preco}</td> 
                    {carro.data.alugado ?
                        <td>{carro.data.dataLiberado}</td>
                        :
                        <td>Sim</td>
                    }
                    <td><Link to={`carros/${carro.id}`}><button className="btn btn-primary btn-default-width" >Editar</button></Link></td>

                </tr>
            )
        } else {
            return (
                <tr key={carro.id}>
                    <td>{carro.data.modelo}</td>
                    <td>{carro.data.marca}</td>
                    <td>{carro.data.cor}</td>
                    <td>{carro.data.preco}</td>
                    {carro.data.alugado ?
                        <td>{carro.data.dataLiberado}</td>
                        :
                        <td>Sim</td>
                    }
                    {carro.data.alugado ?
                        carro.data.idUsuario === this.state.usrData.id ?
                            (<td><button onClick={() => { this.cancelaCarro(carro.id) }} className="btn btn-danger btn-default-width" >Cancelar</button></td>)
                            :
                            (<td><button onClick={() => {}} className="btn btn-danger btn-default-width" disabled>Alugado</button></td>)

                        :
                        (                    <td><Link to={`carros/${carro.id}`}><button className="btn btn-primary btn-default-width" >Alugar</button></Link></td>
                        )
                    }

                </tr>
            )
        }
    }

    render() {
        if (this.state.loading) {
            return (
                <div className="container">
                    Carregando...
                </div>
            )
        } else {
            return (
                <div className="container">
                    <table className="table">
                        <thead>
                            <th className="th-big-width">Modelo</th> {/*30%*/}
                            <th className="th-big-width">Marca</th> {/*30%*/}
                            <th className="th-small-width">Cor</th> {/*10%*/}
                            <th className="th-small-width">Preço</th>{/*10%*/}
                            <th className="th-small-width">Disponível</th>{/*10%*/}
                            <th className="th-small-width"></th>{/*10%*/}
                        </thead>
                        <tbody>
                            {this.state.data.map(this.renderCarros)}
                        </tbody>
                    </table>
                </div>
            )

        }

    }
}
