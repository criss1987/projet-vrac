import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { TextField } from '@material-ui/core';
import '../App.css'
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Grid from '@material-ui/core/Grid';

function Dashboard() {

    const [user, setUser] = useState(null)
    const [expanded, setExpanded] = useState(false);
    const [produits, setProduits] = useState([])

    // une fois que le composant est chargé cette fonction se lance
    useEffect(() => {
        // cette fonction vérifie si l'utilisateur est réellement connecté
        // c'est à dire si l'objet utilisateur est stocké dans le localstorage
        const u = localStorage.getItem('user');
        if (u) {
            setUser(JSON.parse(u))
        } else {
            alert("Vous n'avez pas le droit d'accéder à cette page. Merci de vous logger")
            window.location = "/login"
        }
    }, [])

    // une fois que le composant est chargé, on récupère tous les produits et on les affiche
    useEffect(() => {
        axios.get('http://localhost:3001/users/getproducts').then(res => {
            console.log(res.data)
            setProduits(res.data.products)
        })
    }, [])

    const useStyles = makeStyles((theme) => ({
        root: {
            maxWidth: 345,
            margin: 10
        },
        media: {
            height: 0,
            paddingTop: '56.25%', // 16:9
        },
        expand: {
            transform: 'rotate(0deg)',
            marginLeft: 'auto',
            transition: theme.transitions.create('transform', {
                duration: theme.transitions.duration.shortest,
            }),
        },
        expandOpen: {
            transform: 'rotate(180deg)',
        },
        avatar: {
            backgroundColor: red[500],
        },
    }));


    const classes = useStyles();
    const addProduct = (product) => {
        let products = localStorage.getItem('products');
        if (products) {
            products = JSON.parse(products)
            products.push(product)
            localStorage.setItem('products', JSON.stringify(products))
        } else {
            localStorage.setItem('products', JSON.stringify([product]))
        }
    }
    if (user != null) {
        return (
            <div>
                <Grid container style={{
                    flexGrow: 1,
                }} spacing={2}>
                    {produits.map((produit, index) =>
                        <Grid item xs={3}>
                            <Card key={'produit' + index} className={classes.root}>
                                <CardHeader

                                    action={
                                        <IconButton aria-label="settings">
                                            <MoreVertIcon />
                                        </IconButton>
                                    }
                                    title={produit.nom_produit}
                                    subheader={<Button onClick={() => window.location = '/profile-vendor/' + produit.producteur_id}>{produit.nom_entreprise}</Button>}
                                />
                                <CardMedia
                                    className={classes.media}
                                    image={produit.img_url}
                                    title="Produit"
                                />
                                <CardContent>
                                    <Typography variant="body2" color="textSecondary" component="p">
                                        {produit.description_courte}
                                    </Typography>
                                </CardContent>
                                <CardActions disableSpacing>
                                    <IconButton aria-label="add to cart" onClick={() => addProduct(produit)}>
                                        <AddShoppingCartIcon />
                                    </IconButton>
                                    <IconButton aria-label="share">
                                        <ShareIcon />
                                    </IconButton>

                                </CardActions>
                                <Collapse in={true} timeout="auto" unmountOnExit>
                                    <CardContent>
                                        <Typography paragraph>
                                            {produit.description_longue}
                                        </Typography>

                                    </CardContent>
                                </Collapse>
                            </Card>
                        </Grid>)}
                </Grid>

                Bienvenu sur votre dashboard {user.nom} {user.prenom}
            </div>
        )
    } else {
        return null
    }


}


// chaque composant doit être exporté pour pouvoir l'utiliser ailleurs
export default Dashboard