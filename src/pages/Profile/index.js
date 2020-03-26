import React, { useState, useEffect } from 'react';
import logoImage from '../../assets/logo.svg';
import {Link, useHistory} from 'react-router-dom';
import {FiPower, FiTrash2} from 'react-icons/fi';
import './style.css';
import api from '../../services/apis'

export default function Profile(){
    const [incidents, setIncidents] = useState([]);

    const ongName = localStorage.getItem('ongName');
    const ongId = localStorage.getItem('ongId');
    const history = useHistory();
    useEffect(()=> {

        api.get('profile', {headers :{
            authorization:ongId
        }}).then(response => {
            setIncidents(response.data)
        })
    }, [ongId]);

   async function handleDeleteIncident(id){
        try{
           const rep = await api.delete(`incidents/${id}`, {
                headers:{
                    authorization: ongId,
                }
            });
            setIncidents(incidents.filter(incident => incident.id !== id));
            alert('Caso excluido com sucesso');
           
        }catch{
            alert('Erro ao deletar o caso, tente novamente');
        } 

    }

    function handleLogout(){
        localStorage.clear();
        history.push('/');

    }

    return(

         <div className="profile-container">
             <header>
                 <img src={logoImage} alt="Be the Hero"/>
                 <span>Bem Vindo(a) {ongName}</span>
                 <Link to = '/incidents/new' className = 'button' >Cadastrar novo caso</Link>
                 <button onClick = {handleLogout} type = 'button'><FiPower size = {18} color ="#e02041"></FiPower> </button>
             
             </header>
             <h1>Casos cadastrados</h1>

             <ul>
             {incidents.map(incident => (
                 <li key={incident.id}>
                    <strong>Caso:</strong>
                    <p>{incident.title}</p>

                    <strong>Descrição</strong>
                    <p>{incident.description}</p>

                    <strong>Valor</strong>
                    <p>{Intl.NumberFormat('pt-br', {style:'currency', currency:'BRL'}).format(incident.value)}</p>

                    <button type = "button" onClick = {() => handleDeleteIncident(incident.id)}><FiTrash2 size = {20} color = "#a8a8b3" ></FiTrash2></button>
                 </li>
             
             ))}

             </ul>
         </div>
    );
}