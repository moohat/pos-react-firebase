/* eslint-disable no-fallthrough */
/* eslint-disable no-unused-vars */
/* eslint-disable default-case */
/* eslint-disable no-undef */
import React, { useRef, useState } from 'react';
//material-ui
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useFirebase } from '../../../components/FirebaseProvider';
import useStyles from './styles/pengguna';
import { useSnackbar } from 'notistack';
import isEmail from 'validator/lib/isEmail';

function Pengguna() {
    const classes = useStyles();
    const { user } = useFirebase();
    const [error, setError] = useState({
        displayName: '',
        email: '',
        password: ''
    })
    const { enqueueSnackbar } = useSnackbar();
    const [isSubmitting, setSubmitting] = useState(false);
    const displayNameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();


    const saveDisplayName = async (e) => {
        const displayName = displayNameRef.current.value;
        console.log(displayName);

        if (!displayName) {
            setError({
                displayName: 'Nama Wajib diisi'
            })
        } else if (displayName !== user.displayName) {
            setError({
                displayName: ''
            })
            setSubmitting(true);
            await user.updateProfile({
                displayName
            })

            setSubmitting(false);
            enqueueSnackbar('Data Pengguna berhasil diperbaharui', { variant: 'success' })
        }

    }

    const updateEmail = async (e) => {
        const email = emailRef.current.value;
        console.log(email);


        if (!email) {
            setError({
                email: 'Email Wajib diisi'
            })
        } else if (!isEmail(email)) {
            setError({
                email: 'Email tidak valid'
            })
        } else if (email !== user.email) {
            // setError()({
            //     email: ''
            // })
            setSubmitting(true);
            try {
                await user.updateEmail(email);
                enqueueSnackbar('Email berhasil diperbaharui', { variant: 'success' });
            } catch (e) {
                let emailError = '';
                switch (e.code) {
                    case 'auth/email-already-in-use':
                        emailError = "Email sudah digunakan";
                        break;
                    case 'auth/invalid-email':
                        emailError = 'Email tidak valid';
                        break;
                    case 'auth/requires-recent-login':
                        emailError = "Silahkan logout, kemudian login kembali untuk memberbarui email"
                        break;
                    default:
                        emailError = "Terjadi kesalahan, silahkan coba lagi";
                        break;
                }
                setError({
                    email:emailError
                })

            }
            setSubmitting(false)
        }

    }

    const updatePassword = async (e) => {
        const password = passwordRef.current.value;
        if(!password){
            setError({
                password: 'Password wajib diisi'
            })
        }else{
            setSubmitting(true)
            try {
                await user.updatePassword(password);
                enqueueSnackbar('Password berhasil diperbaharui', { variant: 'success' });

            } catch (e) {
                let errorPassword = '';
            
                switch (e.code) {
                    case 'auth/weak-password':
                        errorPassword = "Password Lemah, isi password lebih kompleks"                        
                        break;
                    case 'auth/requires-recent-login':
                        errorPassword = "Silahkan logout, kemudian login kembali untuk memberbarui email"
                    break;
                
                    default:
                        errorPassword = "Terjadi kesalahan, silahkan coba lagi"
                        break;
                }
                setError({
                    password: errorPassword
                })
                
            }
            setSubmitting(false)
        }

    }



    const sendEmailVerification = async (e) => {
        const actionCodeSettings = {
            url: `${window.location.origin}/login`
        };
        setSubmitting(true)
        await user.sendEmailVerification(actionCodeSettings);
        enqueueSnackbar(`Email verfikasi telah dikirm ke ${emailRef.current.value}`, {
            variant: 'success'});
        setSubmitting(false)
    }
    return <div className={classes.pengaturanPengguna}>
        <TextField
            id="displayName"
            name="displayName"
            label="Name"
            margin="normal"
            defaultValue={user.displayName}
            inputProps={{
                ref: displayNameRef,
                onBlur: saveDisplayName
            }}
            disabled={isSubmitting}
            helperText={error.displayName}
            error={error.displayName ? true : false}
        />

        <TextField
            id="email"
            name="email"
            label="Email"
            margin="normal"
            type="email"

            defaultValue={user.email}
            inputProps={{
                ref: emailRef,
                onBlur: updateEmail
            }}
            disabled={isSubmitting}
            helperText={error.email}
            error={error.email ? true : false}

        />
        {
            user.emailVerified ?
            <Typography variant="subtitle1" color="primary">Email sudah terverifikasi</Typography>
            :


        <Button
            variant="outlined"
            onClick = {sendEmailVerification}
            disabled={isSubmitting}
        >Kirim Email Verifikasi</Button>
        }

<TextField
            id="password"
            name="password"
            label="password Baru"
            margin="normal"
            type="password"

            defaultValue={user.password}
            inputProps={{
                ref: passwordRef,
                onBlur: updatePassword
            }}
            autoComplete = "new-password"
            disabled={isSubmitting}
            helperText={error.password}
            error={error.password ? true : false}

        />

    </div>
}

export default Pengguna;