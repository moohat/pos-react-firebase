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


function Registrasi() {
    const classes = useStyles();
    const [form, setForm] = useState({
        email: '',
        password: '',
        ulangi_password: '',
    });

    const [error, setError] = useState({
        email: '',
        password: '',
        ulangi_password: ''
    });

    const [isSubmitting, setSubmitting] = useState(false);

    const {auth, user} = useFirebase();

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

        if (!form.password) {
            newError.password = 'Password wajib diisi'
        }
        if (!form.ulangi_password) {
            newError.ulangi_password = 'Ulangi password wajib diiisi'
        } else if (form.ulangi_password !== form.password) {
            newError.ulangi_password = 'Ulangi password tidak sama adenga password'
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
                await auth.createUserWithEmailAndPassword(form.email, form.password)
            } catch (e) {
                const newError = {};
                switch (e.code) {
                    case 'auth/email-already-in-use':
                        newError.email = 'Email Sudah Terdaftar'
                        break;
                    case 'auth/invalid-email':
                        newError.email = 'Email tidak valid';
                        break;
                    case 'auth/weak-password':
                        newError.password = 'Password lemah';
                        break;
                    case 'auth/operation-not-allowed':
                        newError.email = 'Metode email dan password tidak didukung'
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

    // console.log(user);
    if(user){
        return <Redirect to="/" />
    }

    return <Container maxWidth="xs">
        <Paper className={classes.paper}>

            <Typhography
                variant="h5"
                component="h1"
                className={classes.title}>Buat Akun Baru</Typhography>
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

                <TextField
                    id="password"
                    type="password"
                    name="password"
                    margin="normal"
                    label="Password"
                    fullWidth="100%"
                    required
                    value={form.password}
                    onChange={handleCHange}
                    helperText={error.password}
                    error={error.password ? true : false}
                    disabled={isSubmitting}


                />

                <TextField
                    id="password"
                    type="password"
                    name="ulangi_password"
                    margin="normal"
                    label="Ulangi Password"
                    fullWidth="100%"
                    required
                    value={form.ulangi_password}
                    onChange={handleCHange}
                    helperText={error.ulangi_password}
                    error={error.ulangi_password ? true : false}
                    disabled={isSubmitting}

                />

                <Grid container className={classes.buttons}>
                    <Grid item xs>
                        <Button type="submit"
                            color="primary"
                            variant="contained"
                            size="large">Daftar</Button>
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

export default Registrasi;