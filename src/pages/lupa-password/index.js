/* eslint-disable default-case */
import React, { useState } from 'react';

//import komponen material ui
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Typhography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'


//import styles
import useStyles from './styles';
//react router dom
import { Link, Redirect } from 'react-router-dom';

import isEmail from 'validator/lib/isEmail';


//fireabase hook
import { useFirebase } from '../../components/FirebaseProvider'

//app component
import AppLoading from '../../components/AppLoading'

// notistack hook

import {useSnackbar} from 'notistack'


function LupaPassword() {
    const classes = useStyles();
    const [form, setForm] = useState({
        email: '',
       
    });

    const [error, setError] = useState({
        email: '',
       
    });

    const [isSubmitting, setSubmitting] = useState(false);

    const {auth, user,loading} = useFirebase();

    const {enqueueSnackbar} = useSnackbar();

    const handleCHange = e => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
        setError({
            ...error,
            [e.target.name]: ''
        })
    }

    const validate = () => {
        const newError = { ...error };

        if (!form.email) {
            newError.email = 'Email Wajib diisi'
        } else if (!isEmail(form.email)) {
            newError.email = 'email tidak valid'
        }

       

        return newError;
    }

    const handleSubmit = async e => {
        e.preventDefault();
        const findErrors = validate();

        if (Object.values(findErrors).some(err => err !== '')) {
            setError(findErrors);
        } else {
            try {
                setSubmitting(true);
                const actionCodeSettings = {
                    url:`${window.location.origin}/login`
                }
                await auth.sendPasswordResetEmail(form.email, actionCodeSettings);
                enqueueSnackbar(`Cek Kotak masuk email: ${form.email}, sebuah tautan untuk me-reset password telah dikirim`,{
                    variant: 'success'
                })
                setSubmitting(false);

            } catch (e) {
                const newError = {};
                switch (e.code) {
                    case 'auth/user-not-found':
                        newError.email = 'Email Tidak Terdaftar'
                        break;
                    case 'auth/invalid-email':
                        newError.email = 'Email tidak valid';
                        break;                  
                    default:
                        newError.email = 'Terjadi kesalahan silahkan coba lagi'
                        break;

                }
                setError(newError);
                setSubmitting(false);
            }
        }
    }



    //loading
    if(loading){
        return <AppLoading />
    }

    // jika user terdaftar
    if(user){
        return <Redirect to="/" />
    }

    return <Container maxWidth="xs">
        <Paper className={classes.paper}>

            <Typhography
                variant="h5"
                component="h1"
                className={classes.title}>Lupa Password</Typhography>
            <form onSubmit={handleSubmit} noValidate>
                <TextField
                    id="email"
                    type="email"
                    name="email"
                    margin="normal"
                    label="Alamat Email"
                    fullWidth="100%"
                    required
                    value={form.email}
                    onChange={handleCHange}
                    helperText={error.email}
                    error={error.email ? true : false}
                    disabled={isSubmitting}
                />

               

                <Grid container className={classes.buttons}>
                    <Grid item xs>
                        <Button type="submit"
                            color="primary"
                            variant="contained"
                            size="large">Kirim</Button>
                    </Grid>
                    <Grid item>
                        <Button
                            component={Link}
                            variant="contained"
                            size="large"
                            to="/login"
                        >Login</Button>
                    </Grid>
                </Grid>

            </form>

        </Paper>
    </Container>
}

export default LupaPassword;