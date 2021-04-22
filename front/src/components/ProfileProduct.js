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

function ProfileProduct() {

    const [user, setUser] = useState(null)
    const [expanded, setExpanded] = useState(false);
    const [product, setProduct] = useState(null)
    const [vendor, setVendor] = useState(null)
    const { product_id } = useParams();
    // une fois que le composant est chargé cette fonction se lance
    useEffect(() => {
        // cette fonction vérifie si l'utilisateur est réellement connecté
        // c'est à dire si l'objet utilisateur est stocké dans le localstorage
        const u = localStorage.getItem('user');
        if (u) {
            setUser(JSON.parse(u))
        }
    }, [])

    // une fois que le composant est chargé, on récupère tous les produits et on les affiche
    useEffect(() => {
        axios.get('http://localhost:3001/users/getprofileproduct/' + product_id).then(res => {
            if (res.data.success) {
                setProduct(res.data.product)
                setVendor(res.data.vendor)
            } else {
                alert(res.data.message)
            }
        })
    }, [])

    const useStyles = makeStyles((theme) => ({
        root: {
            width: 700,
            margin: 10
        },
        media: {

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

    if (product != null) {
        return (
            <div >
                <Grid container justify="center" spacing={2}>
                    <Grid item>
                        {vendor && <Card className={classes.root}>
                            <CardHeader
                                title={vendor.nom_entreprise}
                                subheader={vendor.categorie}
                            />

                            <CardContent>
                                <Typography variant="h4" gutterBottom>
                                    Gérant: {vendor.nom_gerant} {vendor.prenom_gerant}
                                </Typography>

                            </CardContent>

                        </Card>}
                    </Grid>
                    <Grid item>
                        {product && <Card className={classes.root}>
                            <CardHeader

                                action={
                                    <IconButton aria-label="settings">
                                        <MoreVertIcon />
                                    </IconButton>
                                }
                                title={product.nom_produit}
                                subheader={product.nom_entreprise}
                            />
                            <CardMedia
                                className={classes.media}
                                image={product.img_url}
                                title="Produit"
                            />
                            <CardContent>
                                <Typography variant="h4" gutterBottom>
                                    {product.prix_produit} €
                        </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    {product.description_courte}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    Frais de port: {user != null ? product.frais_port + "€" : "Connectez-vous pour le connaître"}
                                </Typography>
                            </CardContent>
                            <CardActions disableSpacing>
                                <IconButton aria-label="add to favorites">
                                    <FavoriteIcon />
                                </IconButton>
                                <IconButton aria-label="share">
                                    <ShareIcon />
                                </IconButton>

                            </CardActions>
                            <Collapse in={true} timeout="auto" unmountOnExit>
                                <CardContent>
                                    <Typography paragraph>
                                        {product.description_longue}
                                    </Typography>

                                </CardContent>
                            </Collapse>
                        </Card>}
                    </Grid>
                </Grid>

            </div>
        )
    } else {
        return <div>Chargement en cours</div>
    }


}


// chaque composant doit être exporté pour pouvoir l'utiliser ailleurs
export default ProfileProduct