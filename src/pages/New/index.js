import './new.css'
import Header from '../../components/Header';
import Title from '../../components/Title';

import {FiPlusCircle} from 'react-icons/fi'
import { useState,useEffect,useContext } from 'react';
import firebase from '../../services/firebaseConnection';
import {useHistory,useParams} from 'react-router-dom'
import { AuthContext } from '../../context/auth';
import { toast } from 'react-toastify';

export default function New(){
  const [loadCustomers,setLoadCustomers] = useState(true);
  const [customers,setCustomers] = useState([]);
  const [customerSelected,setCustomerSelected] = useState(0);
  const [assunto,setAssunto] = useState('Suporte');
  const [status, setStatus] = useState('Aberto')
  const [complemento,setComplemento] = useState('');

  const {user} = useContext(AuthContext);
  const {id} = useParams();
  const history = useHistory();


  const [idCustomer,setIdCustomer] = useState(false);

  useEffect(()=>{
    async function loadCustomers(){
      await firebase.firestore().collection('customers')
        .get()
        .then((snapshot)=>{
          let lista= [];
          snapshot.forEach((doc)=>{
            lista.push({
              id:doc.id,
              nomeFantasia: doc.data().nomeFantasia
            })
          })
          if(lista.length === 0){
            console.log('Nenhuma empresa encontrada!');
            setCustomers([{id: '1',nomeFantasia: 'FREELA'}]);
            setLoadCustomers(false);
            return;
          }
          setCustomers(lista);
          setLoadCustomers(false);
          if(id){
            loadId(lista);
          }
        })
        .catch((error)=>{
          console.log('Deu erro!');
          setLoadCustomers(false);
          setCustomers([{id: '1',nomeFantasia: 'Erro'}]);
          
        })
    }
    loadCustomers();
  },[id]);

  async function loadId(lista){
    await firebase.firestore().collection('chamados').doc(id)
      .get()
      .then((snapshot)=>{
        setAssunto(snapshot.data().assunto)
        setStatus(snapshot.data().status)
        setComplemento(snapshot.data().complemento)
        let index = lista.findIndex((item) => item.id === snapshot.data().clienteId);

        setCustomerSelected(index);
        setIdCustomer(true);
      })
      .catch((err)=>{
        console.log('ERRO NO ID PASSADO:', err);
        setIdCustomer(false);
      })
  }
  async function handleRegister(e){
    e.preventDefault();

    if(idCustomer){
      await firebase.firestore().collection('chamados')
        .doc(id)
        .update({
          cliente: customers[customerSelected].nomeFantasia,
          clienteId: customers[customerSelected].id,
          assunto: assunto,
          status: status,
          complemento: complemento,
          userId: user.uid
        })
        .then(()=>{
          toast.success('Chamado editado com sucesso');
          setCustomerSelected(0);
          setComplemento('');
          history.push('/dashboard')
        })
        .catch((err)=>{
          toast.error('Ops erro ao registrar. tente mais tarde.')
          console.log(err);
        })
        return;
    }

    await firebase.firestore().collection('chamados')
      .add({
        created: new Date(),
        cliente: customers[customerSelected].nomeFantasia,
        clienteId: customers[customerSelected].id,
        assunto: assunto,
        status: status,
        complemento: complemento,
        userId: user.uid
      })
      .then(()=>{
        toast.success('Chamado criado com sucesso!');
        setComplemento('');
        setCustomerSelected(0);
      })
      .catch((err)=>{
        toast.error('Ops erro ao registrar. Tente mais tarde!')
        console.log(err);
      })
  }
  function handleChangeSelect(e){
    setAssunto(e.target.value);
  }
  function handleOptionChange(e){
    setStatus(e.target.value);
  }
  function handleChangeCustomers(e){
   // console.log('INDEX DO CLIENTE SELECIONADO: ', e.target.value);
   // console.log('Cliente selecionado: ', customers[e.target.value]);
    setCustomerSelected(e.target.value)
  }

  return(
    <div>
      <Header/>
      <div className="content">
        <Title name="Novo chamado">
          <FiPlusCircle size={25}/>
        </Title>

        <div className="container">
          <form className="form-profile" onSubmit={handleRegister}>
            <label>Cliente</label>
            {loadCustomers ? (
              <input type="text" disabled={true} 
                value="Carregando clientes..." />
            ):(
              <select value={customerSelected} onChange={handleChangeCustomers}>
              {customers.map((item,index)=>{
                return(
                  <option key={item.id} value={index}>
                    {item.nomeFantasia}
                  </option>
                )
              })}
            </select>
            )}
            
            <label>Assunto</label>
            <select value={assunto} onChange={handleChangeSelect}>
              <option value="Suporte">Suporte</option>
              <option value="Visita técnica">Visita técnica</option>
              <option value="Financeiro">Financeiro</option>
            </select>
            <label>Status</label>
            <div className="status">
              <input type="radio" name="radio" checked={status ==='Aberto'} 
                value="Aberto" onChange={handleOptionChange}/>
              <span>Em aberto</span>
              
              <input type="radio" name="radio" checked={status ==='Progresso'}
               value="Progresso" onChange={handleOptionChange}/>
              <span>Progresso</span>

              <input type="radio" name="radio" checked={status ==='Atendido'}
               value="Atendido" onChange={handleOptionChange}/>
              <span>Atendido</span>
            </div>
            <label>Complemento</label>
            <textarea type="text" placeholder="Descreva seu problema (opcional)."
              value={complemento} 
              onChange={(e) => setComplemento(e.target.value)}/>

            <button type="submit"> Registrar </button>
          </form>
        </div>

      </div>
      
    </div>
  )

}