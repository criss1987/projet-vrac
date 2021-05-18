import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { Card, TextField, CardContent, Typography, CircularProgress } from '@material-ui/core';
import '../App.css'
import axios from 'axios'


const regexEmail = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;


const emailValidator = (email) => {
    return RegExp(regexEmail).test(email) // ça retourne true si l'email est valide, et false si l'email n'est pas valide
}

function AddVendor() {


    const [nom_entreprise, setNomEntreprise] = useState("") // déclaration du state nom suivi de la fonction setNom qui permet de le mettre à jour
    const [nom_gerant, setNomGerant] = useState("")
    const [prenom_gerant, setPrenomGerant] = useState("")
    const [email, setEmail] = useState("")
    const [adresse, setAdresse] = useState("")
    const [categorie, setCategorie] = useState("")
    const [loading, setLoading] = useState(false)


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


    function addVendor() {
        setLoading(true)
        axios.post('http://localhost:3001/users/addvendor', { nom_entreprise, nom_gerant, prenom_gerant, email, adresse, categorie, userId: user.user_id })
            .then(res => {
                setNomEntreprise("")
                setNomGerant("")
                setPrenomGerant("")
                setEmail("")
                setAdresse("")
                setCategorie("")
                alert(res.data.message)
            })
            .catch(e => alert(e))
            .finally(() => setLoading(false))

    }


    return (
        <div className="card-form">
            <Card style={{ padding: 40 }}>
                <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                        Ajouter un producteur
                     </Typography>
                    <div style={{ margin: 10 }}>
                        <TextField value={nom_entreprise} onChange={e => setNomEntreprise(e.target.value)} label="Nom Entreprise" variant="outlined" type="text" />
                    </div>
                    <div style={{ margin: 10 }}>
                        <TextField value={nom_gerant} onChange={e => setNomGerant(e.target.value)} label="Nom Gerant" variant="outlined" type="text" />
                    </div>
                    <div style={{ margin: 10 }}>
                        <TextField value={prenom_gerant} onChange={e => setPrenomGerant(e.target.value)} label="Prenom Gerant" variant="outlined" type="text" />
                    </div>
                    <div style={{ margin: 10 }}>
                        <TextField value={email} onChange={e => setEmail(e.target.value)} label="Email" variant="outlined" type="email" error={emailValidator(email) == false && email} />
                    </div>
                    <div style={{ margin: 10 }}>
                        <TextField value={adresse} onChange={e => setAdresse(e.target.value)} label="Adresse" variant="outlined" type="text" />
                    </div>
                    <div style={{ margin: 10 }}>
                        <TextField value={categorie} onChange={e => setCategorie(e.target.value)} label="Catégorie" variant="outlined" type="text" />
                    </div>
                    <Button variant="contained" color="primary" onClick={addVendor} disabled={!nom_entreprise || !nom_gerant || !prenom_gerant || emailValidator(email) == false || !adresse || !categorie || loading}>Ajouter un producteur</Button>
                    {loading && <CircularProgress size={24} />}


                </CardContent>

            </Card>
        </div>
    )


}


export default AddVendor