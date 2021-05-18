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

function UpdateProduct() {

    const [user, setUser] = useState(null)
    const [expanded, setExpanded] = useState(false);
    const [product, setProduct] = useState(null)
    const [vendor, setVendor] = useState(null)

    const [nom_produit, setNomProduit] = useState("")
    const [prix_produit, setPrixProduit] = useState("")
    const [description_courte, setDescriptionCourte] = useState("")
    const [description_longue, setDescriptionLongue] = useState("")
    const [frais_port, setFraisPort] = useState("")
    const [file, setFile] = useState(null)
    const [img_url, setImgUrl] = useState("")


    const { product_id } = useParams();
    // une fois que le composant est chargé cette fonction se lance
    useEffect(() => {
        // cette fonction vérifie si l'utilisateur est réellement connecté
        // c'est à dire si l'objet utilisateur est stocké dans le localstorage
        const u = localStorage.getItem('user');
        if (u) {
            const parsedUser = JSON.parse(u)
            if (parsedUser.admin) {
                setUser(JSON.parse(u))

            } else {
                window.location = "/dashboard"

            }
        } else {
            window.location = "/dashboard"
        }
    }, [])

    // une fois que le composant est chargé, on récupère tous les produits et on les affiche
    useEffect(() => {
        axios.get('http://localhost:3001/users/getprofileproduct/' + product_id).then(res => {
            if (res.data.success) {
                setProduct(res.data.product)
                setNomProduit(res.data.product.nom_produit)
                setPrixProduit(res.data.product.prix_produit)
                setDescriptionCourte(res.data.product.description_courte)
                setDescriptionLongue(res.data.product.description_longue)
                setFraisPort(res.data.product.frais_port)
                setImgUrl(res.data.product.img_url)
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


    const updateProduct = () => {

        axios.put('http://localhost:3001/users/updateproduct', { nom_produit, prix_produit, description_courte, description_longue, frais_port, img_url, product_id: product.product_id })
            .then(res => {
                console.log(res.data)
                alert(res.data.message)
            }).catch(e => {
                alert(e)
            }).finally(() => {

            })
    }

    function upload() {
        const formData = new FormData()
        formData.append('file', file)
        axios.post('http://localhost:3001/users/upload', formData).then(res => {
            setImgUrl("http://localhost:3001/uploads/" + res.data.url)
        })
    }


    function onFileChange(e) {
        setFile(e.target.files[0])
    }

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


                                title={<TextField value={nom_produit} label={"Nom du produit"} onChange={e => setNomProduit(e.target.value)} />}
                                subheader={product.nom_entreprise}
                            />
                            <form style={{ marginTop: 20 }}>

                                <input type="file" id="contained-button-file" onChange={onFileChange} />
                                <Button variant="contained" component="span" type="button" onClick={upload}>
                                    Upload
                                </Button>

                            </form>
                            <CardMedia
                                className={classes.media}
                                image={img_url}
                                title="Produit"
                            />
                            <CardContent>

                                <TextField value={prix_produit} label={"Prix en €"} onChange={e => setPrixProduit(e.target.value)} />


                                <TextField value={description_courte} label={"Description courte"} onChange={e => setDescriptionCourte(e.target.value)} />


                                <TextField value={frais_port} label={"Frais de port"} onChange={e => setFraisPort(e.target.value)} />

                            </CardContent>

                            <Collapse in={true} timeout="auto" unmountOnExit>
                                <CardContent>

                                    <TextField value={description_longue} label={"Description longue"} onChange={e => setDescriptionLongue(e.target.value)} />


                                </CardContent>
                            </Collapse>
                            <CardActions disableSpacing>
                                <Button color="primary" variant="contained" onClick={updateProduct}>Mettre à jour</Button>
                            </CardActions>
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
export default UpdateProduct