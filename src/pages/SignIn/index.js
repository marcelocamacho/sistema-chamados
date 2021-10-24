import {useState,useContext} from 'react';
import { AuthContext } from '../../context/auth';
import {Link} from 'react-router-dom';
import './signin.css';
import Logo from '../../assets/logo.png'

function SignIn() {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const {signIn,loadingAuth} = useContext(AuthContext);

  function handleSubmit(e){
    e.preventDefault();/*evita que o formulário recarregue a página */
    if(email !== '' && password !== ''){
      signIn(email,password)
    }
  }
    return (
      <div className="container-center">
        <div className="login">
          <div className="login-area">
            <img src={Logo} alt="Logomarca"/>
          </div>
          <form onSubmit={handleSubmit}>{/*Qual a diferença entre o onClick e o onSubmit?*/}
            <h1>Entrar</h1>
            <input type="text" placeholder="email@email.com" 
              value={email} onChange={(e)=>setEmail(e.target.value)}/>
            <input type="password" placeholder="*******" 
              value={password} onChange={(e)=>setPassword(e.target.value)}/>
            <button type="submit">{loadingAuth ? 'Carregando...' : 'Acessar'}</button>
            {/* Renderizaçao Condicional */}
          </form>
          <Link to="/register">Criar uma conta</Link>
        </div>
        
      </div>
    );
  }
  
  export default SignIn;