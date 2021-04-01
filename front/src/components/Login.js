import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import { Card, TextField, CardContent, Typography } from '@material-ui/core';
import '../App.css'
import axios from 'axios'

function Login() {
    const [email, setMail] = useState("")
    const [password, setPassword] = useState("")

    function login() {
        axios.post('http://localhost:3001/users/login', { email, password }).then(res => {
            console.log(res.data)
            if (res.data.success === true) {
                localStorage.setItem('user', JSON.stringify(res.data.user))
                window.location = "/dashboard"
            } else {
                alert(res.data.message)
            }
        })
    }



    return (
        <div className="card-form">
            <Card style={{ padding: 40 }}>
                <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                        Connexion
                     </Typography>
                    <div style={{ margin: 10 }}>
                        <TextField value={email} onChange={e => setMail(e.target.value)} label="Email" variant="outlined" type="email" />
                    </div>
                    <div style={{ margin: 10 }}>
                        <TextField value={password} onChange={e => setPassword(e.target.value)} label="Mot de passe" variant="outlined" type="password" />
                    </div>
                    <Button onClick={login} variant="contained" color="primary">Se connecter</Button>


                </CardContent>

            </Card>
        </div>
    )

}


// chaque composant doit être exporté pour pouvoir l'utiliser ailleurs
export default Login