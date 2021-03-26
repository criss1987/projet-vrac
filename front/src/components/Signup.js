import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import { Card, TextField, CardContent, Typography } from '@material-ui/core';
import '../App.css'
import axios from 'axios'
function Singup() {

    const [nom, setNom] = useState("") // déclaration du state nom suivi de la fonction setNom qui permet de le mettre à jour
    const [prenom, setPrenom] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    function register() {
        axios.post('http://localhost:3001/users/register', { nom, prenom, email, password }).then(res => {
            console.log(res.data)
        })
    }

    return (
        <div className="card-form">
            <Card style={{ padding: 40 }}>
                <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                        Inscription
                     </Typography>
                    <div style={{ margin: 10 }}>
                        <TextField value={nom} onChange={e => setNom(e.target.value)} label="Nom" variant="outlined" type="text" />
                    </div>
                    <div style={{ margin: 10 }}>
                        <TextField value={prenom} onChange={e => setPrenom(e.target.value)} label="Prenom" variant="outlined" type="text" />
                    </div>
                    <div style={{ margin: 10 }}>
                        <TextField value={email} onChange={e => setEmail(e.target.value)} label="Email" variant="outlined" type="email" />
                    </div>
                    <div style={{ margin: 10 }}>
                        <TextField value={password} onChange={e => setPassword(e.target.value)} label="Mot de passe" variant="outlined" type="password" />
                    </div>
                    <Button variant="contained" color="primary" onClick={register}>Créer un compte</Button>


                </CardContent>

            </Card>
        </div>
    )
}

export default Singup;