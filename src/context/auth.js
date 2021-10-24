import {useState,createContext,useEffect} from 'react';
import firebase from '../services/firebaseConnection';
import {toast} from 'react-toastify';

export const AuthContext = createContext({});

function AuthProvider({children}){
    const [user,setUser] = useState(null);//Não permite a entrada em /dashboard
    //const [user,setUser] = useState({id:1,nome:'Marcelo'});//permite acesso ao dashboard
    const [loadingAuth,setLoadingAuth] = useState(false);
    const [loading,setLoading] = useState(true);
    
    useEffect(()=>{
//Verifica se existe algum usuário logado na aplicação e já o add ao contexto
        function loadingStorage(){
            const storageUser = localStorage.getItem('SistemaUser');
            if(storageUser){
                setUser(JSON.parse(storageUser))
                setLoading(false)
            }
            setLoading(false);
        }
        loadingStorage();
    },[])

    function storageUser(data){
        localStorage.setItem('SistemaUser',JSON.stringify(data))
    }

    async function signUp(email,password,nome){
        setLoadingAuth(true);
        await firebase.auth().createUserWithEmailAndPassword(email,password)
            .then(async (value)=>{
                let uid = value.user.uid;
                await firebase.firestore().collection('users')
                    .doc(uid).set({
                        nome: nome,
                        email: email,
                        avatarUrl: null,
                        password: password
                    }).then(()=>{
                        let data = {
                            uid:uid,
                            nome:nome,
                            email:value.user.email,
                            avatarUrl:null
                        };
                        setUser(data);
                        storageUser(data);
                        setLoadingAuth(false);
                        toast.success("Bem vindo");
                    }).catch((error)=>{
                        console.log("Erro ao armazenar no firebase e localStorage")
                        console.log(error)
                        setLoading(false)

                    })
            }).catch((error)=>{
                console.log(error);
                toast.error("Ops algo deu errado!");
                setLoadingAuth(false)
            })
    }

    async function signOut(){
        await firebase.auth().signOut();
        localStorage.removeItem('SistemaUser');
        setUser(null)
    }

    async function signIn(email,password){
        setLoadingAuth(true);
        await firebase.auth().signInWithEmailAndPassword(email,password)
            .then(async (value)=>{
                let uid = value.user.uid;
                const userProfile = await firebase.firestore().collection('users')
                    .doc(uid).get();
                let data = {
                    uid: uid,
                    nome: userProfile.data().nome,
                    avatarUrl: userProfile.data().avatarUrl,
                    email: value.user.email
                }
                setUser(data);
                storageUser(data);
                toast.success("Olá")
                setLoadingAuth(false);
            })
            .catch((error)=>{
                setLoadingAuth(false);
                toast.error("Algo deu errado. Tente de novo!")
                console.log(error);
            })

    }
    return(
        /* !!user -> se a variável estiver setada com algum valor ele devolve true
         senão ele devolve falso*/
        <AuthContext.Provider value={{
            signed: !!user,
            user,
            loading,
            signUp,
            signOut,
            signIn,
            loadingAuth,
            setUser,
            storageUser
            }}>
            {children}
        </AuthContext.Provider>
    )
}
export default AuthProvider;