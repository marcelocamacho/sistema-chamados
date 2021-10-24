import {useState,useContext} from 'react';
import {Link} from 'react-router-dom';
import { AuthContext } from '../../context/auth';

import './signup.css';
import Logo from '../../assets/logo.png'

function SignUp() {
  const [nome,setNome] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  
  const {signUp,loadingAuth} = useContext(AuthContext);

  function handleSubmit(e){
    //evita que o formulário recarregue a página
    e.preventDefault();
    if(nome !== '' && email !== '' && password !== ''){
      signUp(email,password,nome);
      
    }
  }
    return (
      <div className="container-center">
        <div className="login">
          <div className="login-area">
            <img src={Logo} alt="Logomarca"/>
          </div>
          <form onSubmit={handleSubmit}>
            <h1>Entrar</h1>
            <input type="text" placeholder="Digite o seu nome"
              value={nome} onChange={(e)=>setNome(e.target.value)}/>
            <input type="text" placeholder="email@email.com" 
              value={email} onChange={(e)=>setEmail(e.target.value)}/>
            <input type="password" placeholder="*******" 
              value={password} onChange={(e)=>setPassword(e.target.value)}/>
            <button type="submit">{loadingAuth ? 'Carregando' : 'Cadastrar'}</button>
            {/*Renderização condicional */}
          </form>
          <Link to="/">Já tenho uma conta</Link>
        </div>
      </div>
    );
  }
  
  export default SignUp;