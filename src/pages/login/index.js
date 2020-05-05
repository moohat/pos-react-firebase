/* eslint-disable default-case */
import React, { useState } from 'react';

//import komponen material ui
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';


//import styles
import useStyles from './styles';
//react router dom
import { Link, Redirect } from 'react-router-dom';

import isEmail from 'validator/lib/isEmail';


//fireabase hook
import { useFirebase } from '../../components/FirebaseProvider'

//app component
import AppLoading from '../../components/AppLoading'


function Login(props) {
    const {location} = props;
    const classes = useStyles();
    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState({
        email: '',
        password: '',
    });

    const [isSubmitting, setSubmitting] = useState(false);

    const { auth, user, loading } = useFirebase();

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
                await auth.signInWithEmailAndPassword(form.email, form.password)
            } catch (e) {
                const newError = {};
                switch (e.code) {
                    case 'auth/invalid-email':
                        newError.email = 'Email tidak valid';
                        break;
                    case 'auth/wrong-password':
                        newError.password = 'Password salah';
                        break;
                    case 'auth/user-not-found':
                        newError.email = 'user tidak ditemukan'
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

    const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;



    //loading
    if (loading) {
        return <AppLoading />
    }

    // jika user terdaftar
    if (user) {
        const redirectTo = location.state && location.state.from && location.state.from.pathname ? location.state.from.pathname : '/';
        return <Redirect to={redirectTo} />
    }

    return <Container maxWidth="xs">
        <Paper className={classes.paper}>

            <Typography
                variant="h5"
                component="h1"
                className={classes.title}>Login</Typography>
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


                <Grid container className={classes.buttons}>
                    <Grid item xs>
                        <Button type="submit"
                            color="primary"
                            variant="contained"
                            size="large">Login</Button>
                    </Grid>
                    <Grid item>
                        <Button
                            component={Link}
                            variant="contained"
                            size="large"
                            to="/registrasi"
                        >Daftar</Button>
                    </Grid>
                </Grid>
                <div className={classes.forgotPassword}>

                    <Typography component={Link} to="/lupa-password">
                        Lupa Password
                </Typography>
                </div>
                <div>
      <Button className={classes.buttonPopover} aria-describedby={id} variant="contained" color="primary" onClick={handleClick}>
      Access Account
      </Button>

    </div>
            </form>

        </Paper>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Typography className={classes.typography}>Email : admin@gmail.com <br />Password: 123456789</Typography>
      </Popover>
    </Container>
}

export default Login;