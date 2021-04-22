import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { TextField } from '@material-ui/core';
import '../App.css'
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom'
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
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Grid from '@material-ui/core/Grid';

function ProfileVendor() {

    const [user, setUser] = useState(null)
    const [expanded, setExpanded] = useState(false);
    const [produits, setProduits] = useState([])
    const [vendor, setVendor] = useState(null)
    const { vendor_id } = useParams();
    console.log(vendor_id)
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
        axios.get('http://localhost:3001/users/getprofilevendor/' + vendor_id).then(res => {
            setProduits(res.data.products)
            setVendor(res.data.vendor)
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

    if (user != null) {
        return (
            <div>
                Profil producteur
                {vendor != null && <div>
                    <h2>{vendor.nom_entreprise}</h2>
                </div>}
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
                                    subheader={produit.nom_entreprise}
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
                                    <IconButton aria-label="add to favorites">
                                        <FavoriteIcon />
                                    </IconButton>
                                    <IconButton aria-label="share">
                                        <ShareIcon />
                                    </IconButton>
                                    <Button onClick={() => window.location = "/profile-product/" + produit.product_id}> Voir plus</Button>


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
export default ProfileVendor