import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';




const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
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
        <AppBar position="static">
            <Toolbar>
                <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                    Site Ecommerce
              </Typography>
                {user == null ?
                    <div>
                        <Button color="inherit" onClick={() => window.location = "/login"}>Connexion</Button>
                        <Button color="inherit" onClick={() => window.location = "/signup"}>Inscription</Button>
                    </div>
                    :
                    <div>
                        <Button color="inherit" onClick={logout}>Déconnexion</Button>
                    </div>
                }
            </Toolbar>
        </AppBar>
    );
}

export default Header;
