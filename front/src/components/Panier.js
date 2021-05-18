import React, { useState, useEffect } from 'react';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import axios from 'axios'
import CircularProgress from '@material-ui/core/CircularProgress';


const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
    list: {
        margin: 10,
        border: '2px solid black'
    }
}));


const Panier = (props) => {
    const [listProducts, setListProducts] = useState([])
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)

    const classes = useStyles();

    useEffect(() => {
        let products = localStorage.getItem('products')
        if (products) {
            setListProducts(JSON.parse(products))
        }
        const u = localStorage.getItem('user');
        if (u) {
            setUser(JSON.parse(u))
        }
    }, [])

    const deleteProduct = (product) => {
        let index = listProducts.findIndex(p => p.product_id == product.product_id)
        let produits = [...listProducts]
        produits.splice(index, 1)
        setListProducts(produits)
        localStorage.setItem('products', JSON.stringify(produits))
    }

    const total = listProducts.reduce((acc, curr) => acc + curr.prix_produit + ((curr.tva_produit * curr.prix_produit) / 100), 0)


    const sendDevis = () => {
        setLoading(true)
        axios.post('http://localhost:3001/users/sendDevis', { listProducts, user, total }).then(res => {
            if (res.data.success) {
                // on vide le panier avant de redirigers
                localStorage.removeItem('products')
                alert(res.data.message)
                window.location = "/dashboard"

            }
        }).catch(e => {
            console.log(e)
        }).finally(() => {
            setLoading(false)
        })
    }
    return (

        <div>
            <List
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                        Mon panier
                    </ListSubheader>
                }
                className={classes.root}
            >
                {listProducts.map((product, index) => <ListItem div className={classes.list}>
                    <ListItemText primary={product.nom_produit} />
                    <ListItemAvatar>
                        <Avatar>
                            {product.prix_produit}€
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemAvatar>
                        <Button onClick={() => deleteProduct(product)}>
                            <DeleteIcon />
                        </Button>
                    </ListItemAvatar>
                </ListItem>)}
            </List>
            <h1>Total: {total.toFixed(2)} €</h1>

            <Button onClick={sendDevis} disabled={loading}>Valider le panier</Button>
            {loading && <CircularProgress size={24} />}

        </div>
    )
}



export default Panier
