import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import { Card, TextField, CardContent, Typography } from '@material-ui/core';
import '../App.css'
import axios from 'axios'
import CircularProgress from '@material-ui/core/CircularProgress';


function Login() {
    const [email, setMail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    function login() {
        // on met le loading à true au début
        setLoading(true)
        axios.post('http://localhost:3001/users/login', { email, password }).then(res => {
            console.log(res.data)
            if (res.data.success === true) {
                localStorage.setItem('user', JSON.stringify(res.data.user))
                window.location = "/dashboard"
            } else {
                alert(res.data.message)
            }
        }).catch(e => {
            alert(e)
        }).finally(() => {
            // une fois que la reqête a terminé, peut importe si c'était success ou non, on remet le loading à false
            setLoading(false)
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
                    <Button onClick={login} variant="contained" color="primary" disabled={loading}>Se connecter</Button>
                    {loading && <CircularProgress size={24} />}


                </CardContent>

            </Card>
        </div>
    )

}


// chaque composant doit être exporté pour pouvoir l'utiliser ailleurs
export default Login