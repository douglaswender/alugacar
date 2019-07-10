import React, { Component } from 'react'
import firebase from '../../../Services/Firebase';

export default class Carro extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this)
        this.changeState = this.changeState.bind(this)
        this.state = {
            modelo: '',
            marca: '',
            preco: '',
            visible: true,
            carro: {},
            admin: false,
            loading: true,
            carroId: '',
            checked: true,
            changed: false,
            return: 'Carro atualizado!'
        }
    }
    componentWillMount() {
        this.getIdParams();
    }

    componentDidMount() {
        this.getCarro();

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
                    loading: false,
                    checked: carro.visivel
                })
            }
            );
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
            return (
                <div className="row">
                    <div className="col-sm-4 styled-div">
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
                                <div className="input-group mb-3">
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
                            <div className="alert alert-success" role="alert">
                                {this.state.return}
                            </div>
                            <hr />
                            <button type="button" className="btn btn-primary button-form" onClick={() => { this.salvarCarro() }}>Salvar</button>
                        </form>
                    </div>
                </div>
            )
        }


    }
}
