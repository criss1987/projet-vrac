import React from 'react';
import Button from '@material-ui/core/Button';
import { Card, TextField, CardContent, Typography } from '@material-ui/core';
import '../App.css'
function Singup() {
    return (
        <div className="card-form">
            <Card style={{ padding: 40 }}>
                <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                        Inscription
                     </Typography>
                    <div style={{ margin: 10 }}>
                        <TextField label="Nom" variant="outlined" type="text" />
                    </div>
                    <div style={{ margin: 10 }}>
                        <TextField label="Prenom" variant="outlined" type="text" />
                    </div>
                    <div style={{ margin: 10 }}>
                        <TextField label="Email" variant="outlined" type="email" />
                    </div>
                    <div style={{ margin: 10 }}>
                        <TextField label="Mot de passe" variant="outlined" type="password" />
                    </div>
                    <Button variant="contained" color="primary">S'inscrire</Button>


                </CardContent>

            </Card>
        </div>
    )
}

export default Singup;