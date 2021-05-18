import React, { useState, useEffect } from 'react'
import { Card, CardContent, Typography, TextField, Button, CircularProgress, Badge } from '@material-ui/core'
import '../App.css'

const Profile = (props) => {

    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState(null)


    // une fois que la page a terminé de charger, on récupère le user dans le localStorage
    useEffect(() => {
        const u = localStorage.getItem('user');
        if (u) {
            setUser(JSON.parse(u))
        } else {
            window.location = "/login"
        }
    }, [])


    return (
        <div>
            {user && <div className="card-form">
                <Card style={{ padding: 40 }}>
                    <CardContent>
                        {user.admin ? <Badge color="secondary" badgeContent={"Admin"}></Badge> : null}
                        <Typography color="textSecondary" gutterBottom>
                            Mon profil
                        </Typography>


                        <div style={{ margin: 10 }}>
                            <TextField value={user.email} label="Email" variant="outlined" type="email" disabled={true} />
                        </div>
                        <div style={{ margin: 10 }}>
                            <TextField value={user.nom} label="Nom" variant="outlined" type="text" disabled={true} />
                        </div>
                        <div style={{ margin: 10 }}>
                            <TextField value={user.prenom} label="Prénom" variant="outlined" type="text" disabled={true} />
                        </div>



                    </CardContent>

                </Card>
            </div>}
        </div>
    )
}


export default Profile