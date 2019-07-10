

export default class extends  {
    getUsuarioByEmail(){
        firebase.firestore().collection('usuarios').where("email", "==", user.email).get().then(snapshot => {
            const perfil = snapshot.docs.map(doc => {
                var dados = doc.data();
                this.setState({
                    nome: dados.nome,
                    email: dados.email,
                    isLoading: false
                })
                console.log(this.state)
                return dados;
            })
            this.setState({ usuarioFire: perfil, loading: false });
    
        });
    
    }          
}


