import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import logo from '../assets/logo.png'



const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        zIndex: 9999
    },
    menuButton: {
        margin: theme.spacing(2),
        backgroundColor: "white",
    },
    title: {
        flexGrow: 1,
    },
    header: {
        backgroundColor: "#0a472e"
    }
}));



function Header() {

    const classes = useStyles();

    const [user, setUser] = useState(null)
    // une fois que le composant est chargé cette fonction se lance
    useEffect(() => {
        // cette fonction vérifie si l'utilisateur est réellement connecté
        // c'est à dire si l'objet utilisateur est stocké dans le localstorage
        const u = localStorage.getItem('user');
        if (u) {
            setUser(JSON.parse(u))
        }
    }, [])

    function logout() {
        localStorage.clear()
        window.location = "/"
    }

    return (
        <AppBar position="static" className={classes.header}>
            <Toolbar>
                <IconButton onClick={() => window.location = "/dashboard"} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                    <img src={logo} style={{ width: 80 }} />
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                    Votre solution 100% gagnante pour valoriser les producteurs locaux de la Bretagne
                </Typography>
                {user == null ?
                    <div>
                        <Button size="large" color="inherit" onClick={() => window.location = "/login"}>Connexion</Button>
                        <Button size="large" color="inherit" onClick={() => window.location = "/signup"}>Inscription</Button>
                    </div>
                    :
                    <div>
                        {user.admin ? <Button size="large" color="inherit" onClick={() => window.location = "/addproduct"}>Ajouter un produit</Button> : null}
                        {user.admin ? <Button size="large" color="inherit" onClick={() => window.location = "/addvendor"}>Ajouter un fournisseur</Button> : null}

                        <Button size="large" color="inherit" onClick={() => window.location = "/panier"}>Panier</Button>
                        <Button size="large" color="inherit" onClick={() => window.location = "/profile"}>Profil</Button>

                        <Button size="large" color="inherit" onClick={logout}>Déconnexion</Button>
                    </div>
                }
            </Toolbar>
        </AppBar>
    );
}

export default Header;
