import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { Card, TextField, CardContent, Typography, Select, MenuItem, InputLabel, CircularProgress } from '@material-ui/core';
import '../App.css'
import axios from 'axios'

function AddProduct() {

    const [nom_produit, setNomProduit] = useState("") // déclaration du state nom suivi de la fonction setNom qui permet de le mettre à jour
    const [prix_produit, setPrixProduit] = useState("")
    const [description_courte, setDescriptionCourte] = useState("")
    const [description_longue, setDescriptionLongue] = useState("")
    const [producteur_id, setProducteurId] = useState("")
    const [producteurs, setProducteurs] = useState([])
    const [poids_produit, setPoidsProduit] = useState("")
    const [tva_produit, setTvaProduit] = useState("")
    const [frais_port, setFraisPort] = useState("")
    const [categorie_produit, setCategorieProduit] = useState("")
    const [quantites_disponibles, setQuantitesDisponibles] = useState("")
    const [img_url, setImgUrl] = useState("")
    const [file, setFile] = useState("")
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)
    // une fois que le composant est chargé cette fonction se lance
    useEffect(() => {
        // cette fonction vérifie si l'utilisateur est réellement connecté
        // c'est à dire si l'objet utilisateur est stocké dans le localstorage
        const u = localStorage.getItem('user');
        if (u) {
            setUser(JSON.parse(u))
        }
    }, [])

    useEffect(() => {
        // une fois que le composant est chargé, on récupère les producteurs pour les afficher dans le select
        axios.get('http://localhost:3001/users/getvendors').then(res => {
            console.log(res.data)
            if (res.data.success === true) {
                setProducteurs(res.data.vendors)
            } else {
                alert(res.data.message)
            }
        }).catch(e => {
            alert(e)
        })
    }, [])
    function addProduct() {
        setLoading(true)
        axios.post('http://localhost:3001/users/addproduct', {
            nom_produit, prix_produit, description_courte, description_longue, producteur_id, poids_produit
            , tva_produit, frais_port, categorie_produit, quantites_disponibles, img_url, userId: user.user_id
        }).then(res => {
            setNomProduit("")
            setPrixProduit("")
            setDescriptionCourte("")
            setDescriptionLongue("")
            setProducteurId("")
            setPoidsProduit("")
            setTvaProduit("")
            setFraisPort("")
            setCategorieProduit("")
            setQuantitesDisponibles("")
            setImgUrl("")
            setFile("")
            alert(res.data.message)
        }).catch(e => {
            alert(e)
        }).finally(() => {
            setLoading(false)
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


    return (
        <div style={{ height: "auto", width: "100%" }}>

            <div className="card-form">
                <Card style={{ padding: 40 }}>
                    <CardContent>
                        <Typography color="textSecondary" variant="h4" >
                            Ajouter un produit
                     </Typography>
                        <form style={{ marginTop: 20 }}>
                            <div className="buttons-add-product">
                                <input type="file" id="contained-button-file" onChange={onFileChange} />
                                <button variant="contained" component="span" type="button" onClick={upload}>
                                    Upload
                                </button>
                            </div>
                        </form>
                        <div style={{ margin: 10 }}>
                            <TextField value={nom_produit} onChange={e => setNomProduit(e.target.value)} label="Nom Produit" variant="outlined" type="text" />
                        </div>
                        <div style={{ margin: 10 }}>
                            <TextField value={prix_produit} onChange={e => setPrixProduit(e.target.value)} label="Prix Produit" variant="outlined" type="text" />
                        </div>
                        <div style={{ margin: 10 }}>
                            <TextField value={description_courte} onChange={e => setDescriptionCourte(e.target.value)} label="Description Courte" variant="outlined" type="text" />
                        </div>
                        <div style={{ margin: 10 }}>
                            <TextField value={description_longue} onChange={e => setDescriptionLongue(e.target.value)} label="Description Longue" variant="outlined" type="email" />
                        </div>
                        <div style={{ margin: 10 }}>
                            <InputLabel id="productor-label">Producteur</InputLabel>

                            <Select
                                style={{ width: 200 }}
                                label="Producteur"
                                labelId="productor-label"
                                value={producteur_id}
                                onChange={e => setProducteurId(e.target.value)}
                            >
                                {producteurs.map((producteur, index) => (
                                    <MenuItem key={"prpducteur" + index} value={producteur.vendor_id}>{producteur.nom_entreprise}</MenuItem>

                                ))}
                            </Select>
                        </div>
                        <div style={{ margin: 10 }}>
                            <TextField value={poids_produit} onChange={e => setPoidsProduit(e.target.value)} label="Poids" variant="outlined" type="text" />
                        </div>
                        <div style={{ margin: 10 }}>
                            <TextField value={tva_produit} onChange={e => setTvaProduit(e.target.value)} label="TVA" variant="outlined" type="text" />
                        </div>
                        <div style={{ margin: 10 }}>
                            <TextField value={frais_port} onChange={e => setFraisPort(e.target.value)} label="Frais de port" variant="outlined" type="text" />
                        </div>
                        <div style={{ margin: 10 }}>
                            <TextField value={categorie_produit} onChange={e => setCategorieProduit(e.target.value)} label="Catégorie" variant="outlined" type="text" />
                        </div>
                        <div style={{ margin: 10 }}>
                            <TextField value={quantites_disponibles} onChange={e => setQuantitesDisponibles(e.target.value)} label="Quantité disponible" variant="outlined" type="text" />
                        </div>

                        <Button variant="contained" color="primary" onClick={addProduct}
                            disabled={!nom_produit ||
                                !prix_produit ||
                                !description_courte ||
                                !description_longue ||
                                !producteur_id ||
                                !poids_produit ||
                                !tva_produit ||
                                !frais_port ||
                                !categorie_produit ||
                                !quantites_disponibles ||
                                !img_url ||
                                !file ||
                                loading
                            }
                        >Ajouter un produit</Button>
                        {loading && <CircularProgress size={24} />}

                    </CardContent>

                </Card>
            </div>
        </div>
    )


}


export default AddProduct