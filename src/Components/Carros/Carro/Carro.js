import React, { Component } from 'react'
import firebase from '../../../Services/Firebase';

export default class Carro extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this)
        this.changeState = this.changeState.bind(this)
        this.state = {
            modelo: '',
            usrData: {},
            marca: '',
            preco: '',
            visible: true,
            carro: {},
            isAdmin: false,
            loading: true,
            carroId: '',
            checked: true,
            changed: false,
            dias: 0,
            total: 0,
            return: 'Carro atualizado!',
            err: 'Informe a quantidades de dias!'
        }
    }
    componentWillMount() {
        this.getIdParams();
    }

    componentDidMount() {
        this.getCarro();

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
                            loading: false,
                            isAdmin: true
                        });
                    } else {
                        this.setState({
                            usrData: perfil,
                            loading: false,
                            isAdmin: false,
                        });
                    }

                });
            }
        });
    }

    handleChange(event) {
        let campo = event.target.id;
        this.setState({
            changed: true
        })
        if (campo === 'modelo') {
            console.log(this.state.modelo);
            this.setState({
                modelo: event.target.value
            })
        } else if (campo === 'marca') {
            console.log(this.state.marca);
            this.setState({
                marca: event.target.value
            })
        } else if (campo === 'dias') {
            var total = (event.target.value * Number(this.state.preco));
            console.log(total);
            this.setState({
                dias: event.target.value,
                total: total
            })
        } else {
            console.log(this.state.preco);
            this.setState({
                preco: event.target.value
            })
        }
    }

    changeState() {
        this.setState({
            checked: !this.state.checked,
            changed: true
        })
    }

    getIdParams() {
        console.log(this.props.match.params.id)
        this.setState({
            carroId: this.props.match.params.id
        });
    }
    getCarro() {
        let idCarro = this.state.carroId;
        var carro;
        firebase.firestore().collection('carros').doc(idCarro).get()
            .then(doc => {
                carro = doc.data();
                this.setState({
                    carro: carro,
                    modelo: carro.modelo,
                    marca: carro.marca,
                    preco: carro.preco,
                    visivel: carro.visivel,
                    checked: carro.visivel
                })
            }
            );
        this.getUsuario();

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
        dia = today.getDate() + Number(this.state.dias);
        var finalDate = dia + "/" + mes + "/" + ano;
        if (this.state.dias !== 0) {
            console.log("Você reservou o carro: ", carroId)
            let carroRef = firebase.firestore().collection('carros').doc(carroId);
            carroRef.update({
                alugado: true,
                dataLiberado: finalDate,
                idUsuario: this.state.usrData.id,
                total: this.state.total
            }).then(() => {
                window.location = "/carros";
            });
        }else{
            this.setState({
                err: "Dias não podem ser vazios!"
            })
            
        }

    }

    salvarCarro() {
        let idCarro = this.state.carro.id
        const { modelo, marca, preco, checked } = this.state;
        console.log('check:', checked)
        if (this.state.changed) {
            let idCarro = this.state.carroId;
            firebase.firestore().collection('carros').doc(idCarro).update({
                modelo: modelo,
                marca: marca,
                preco: preco,
                visivel: checked,
            }).then(doc => {
                this.setState({
                    return: "Salvo com sucesso!"
                });
                window.location = "/carros";
            });
        }
        console.log(idCarro);
        
    }

    render() {
        if (this.state.loading) {
            return (
                <div>Carregando...</div>
            )
        } else {
            if (this.state.isAdmin) {
                return (
                    <div className="row styled-div">
                        <div className="col-sm-4 ">
                            <form action="" className="form-group" onSubmit={this.handleSubmit}>
                                <div className="form-group">
                                    <label>Modelo</label>
                                    <input defaultValue={this.state.carro.modelo} onChange={this.handleChange} type="text" name='modelo' id='modelo' className="form-control login-width" />
                                </div>
                                <div className="form-group">
                                    <label>Marca</label>
                                    <input defaultValue={this.state.carro.marca} onChange={this.handleChange} type="text" name='marca' id='marca' className="form-control login-width" />
                                </div>
                                <div className="form-group">
                                    <label>Placa</label>
                                    <input defaultValue={this.state.carro.placa} onChange={this.handleChange} type="text" name='placa' id='placa' className="form-control login-width" disabled />
                                </div>
                                <div className="form-group">
                                    <label>Preço</label>
                                    <div className="input-group mb-3  login-width">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text" id="basic-addon1">R$</span>
                                        </div>
                                        <input type="text" defaultValue={this.state.carro.preco} onChange={this.handleChange} className="form-control" placeholder="00,00" aria-label="Preço" aria-describedby="basic-addon1" name='preco' id='preco' />
                                        <div className="input-group-append">
                                            <span className="input-group-text">/dia</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="custom-control custom-checkbox">
                                    <input defaultChecked={this.state.carro.visivel} onChange={this.changeState} type="checkbox" className="custom-control-input" id="customCheck1" />
                                    <label className="custom-control-label" htmlFor="customCheck1">Deixar o carro visível?</label>
                                </div>
                                <div className="alert alert-success  login-width" role="alert">
                                    {this.state.return}
                                </div>
                                <hr />
                                <button type="button" className="btn btn-primary login-width" onClick={() => { this.salvarCarro() }}>Salvar</button>
                            </form>
                        </div>
                    </div>
                );
            } else {
                return (
                    <div className="row styled-div">
                        <div className="col-sm-4 styled-div">
                            <form action="" className="form-group" onSubmit={this.handleSubmit}>
                                <div className="form-group">
                                    <label>Modelo</label>
                                    <input defaultValue={this.state.carro.modelo} onChange={this.handleChange} type="text" name='modelo' id='modelo' className="form-control login-width" disabled />
                                </div>
                                <div className="form-group">
                                    <label>Marca</label>
                                    <input defaultValue={this.state.carro.marca} onChange={this.handleChange} type="text" name='marca' id='marca' className="form-control login-width" disabled />
                                </div>
                                <div className="form-group">
                                    <label>Placa</label>
                                    <input defaultValue={this.state.carro.placa} onChange={this.handleChange} type="text" name='placa' id='placa' className="form-control login-width" disabled />
                                </div>
                                <div className="form-group">
                                    <label>Preço</label>
                                    <div className="input-group mb-3 login-width">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text" id="basic-addon1">R$</span>
                                        </div>
                                        <input type="text" defaultValue={this.state.carro.preco} onChange={this.handleChange} className="form-control" placeholder="00,00" aria-label="Preço" aria-describedby="basic-addon1" name='preco' id='preco' disabled />
                                        <div className="input-group-append">
                                            <span className="input-group-text">/dia</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Dias de aluguel</label>
                                    <input placeholder="0" onChange={this.handleChange} type="text" name='dias' id='dias' className="form-control login-width" required />
                                </div>
                                <div className="form-group">
                                    <label>Valor total</label>
                                    <input value={this.state.total} type="text" name='total' id='total' className="form-control login-width" disabled />
                                </div>
                                <div>
                                    <h6>{this.state.err}</h6>
                                </div>
                                <hr />
                                <button type="button" className="btn btn-primary button-form" onClick={() => { this.alugaCarro(this.state.carroId) }}>Alugar</button>
                            </form>
                        </div>
                    </div>
                );
            }

        }


    }
}
