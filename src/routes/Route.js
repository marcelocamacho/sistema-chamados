import {Route, Redirect} from 'react-router-dom'
import {useContext} from 'react';
import {AuthContext} from '../context/auth'

export default function RouteWrapper(
    {
        component:Component,
        isPrivate,
        ...rest
    }
){
    const {signed,loading} = useContext(AuthContext);


    if(loading){
        return(
            <div>Carregando...</div>
        )
    }
    if(!signed && isPrivate){
        return <Redirect to="/" />
    }
    if(signed && !isPrivate){
        return(
            <Redirect to="/dashboard"/>
        )
    }

    return(
        <Route 
            {...rest}
            render={props => (
                <Component {...props} />
            )}/>
    )
}