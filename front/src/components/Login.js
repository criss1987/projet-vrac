import React from 'react';
import Button from '@material-ui/core/Button';
import { Card, TextField, CardContent, Typography } from '@material-ui/core';
import '../App.css'

function Login() {



    return (
        <div className="card-form">
            <Card style={{ padding: 40 }}>
                <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                        Connexion
                     </Typography>
                    <div style={{ margin: 10 }}>
                        <TextField label="Email" variant="outlined" type="email" />
                    </div>
                    <div style={{ margin: 10 }}>
                        <TextField label="Mot de passe" variant="outlined" type="password" />
                    </div>
                    <Button variant="contained" color="primary">Se connecter</Button>


                </CardContent>

            </Card>
        </div>
    )

}


// chaque composant doit être exporté pour pouvoir l'utiliser ailleurs
export default Login