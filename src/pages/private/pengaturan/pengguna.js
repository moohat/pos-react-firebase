/* eslint-disable no-unused-vars */
/* eslint-disable default-case */
/* eslint-disable no-undef */
import React, { useRef, useState } from 'react';
//material-ui
import TextField from '@material-ui/core/TextField';
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
    })
    const { enqueueSnackbar } = useSnackbar();
    const [isSubmitting, setSubmitting] = useState(false);
    const displayNameRef = useRef();
    const emailRef = useRef();


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

            defaultValue={user.email}
            inputProps={{
                ref: emailRef,
                onBlur: updateEmail
            }}
            disabled={isSubmitting}
            helperText={error.email}
            error={error.email ? true : false}

        />
    </div>
}

export default Pengguna;