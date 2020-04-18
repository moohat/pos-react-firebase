import React, { useState, useEffect } from 'react';

//material-ui
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import useStyles from './styles/toko';

//validator
import isURL from 'validator/lib/isURL';
import { useFirebase } from '../../../components/FirebaseProvider';
import { useSnackbar } from 'notistack';
import { useDocument } from 'react-firebase-hooks/firestore';
import AppPageLoading from '../../../components/AppPageLoading';

//react router
import {Prompt} from 'react-router-dom'



function Toko() {
    const classes = useStyles();
    const {firestore, user} = useFirebase();
    const tokoDoc = firestore.doc(`toko/${user.uid}`);
    const [snapshot, loading] = useDocument(tokoDoc);
    

    const {enqueueSnackbar} = useSnackbar();


    const [form, setForm] = useState({
        nama: '',
        alamat: '',
        telepon: '',
        website: '',
    });
    const [error, setError] = useState({
        nama: '',
        alamat: '',
        telepon: '',
        website: '',
    });

    const [isSubmitting, setSubmitting] = useState(false);


    const[isSomethingChange, setSomethingChange] = useState(false);

    useEffect(() => {
       if(snapshot){
           setForm(snapshot.data());
       }
    }, [snapshot])

    const handleChange = e => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        })

        setError({
            [e.target.name]: ''
        })
        setSomethingChange(true);
    }

    const validate = () => {
        const newError = {...error};

        if(!form.nama){
            newError.nama = 'Nama Wajib diiisi';
        }
        if(!form.alamat){
            newError.alamat = 'Alamat wajib diisi';
        }
        if(!form.telepon){
            newError.telepon = 'Telepon Wajib diisi';
        }
        if(!form.website){
            newError.website = 'Website wajib diisi';
        }else if(!isURL(form.website)){
            newError.website = 'Website tidak valid'
        }
        return newError;
    }

    const handleSubmit = async e =>{
        e.preventDefault();

        const findErrors = validate();
        if(Object.values(findErrors).some(err=>err!=='')){
            setError(findErrors);

        }else{
            setSubmitting(true);
            try {
                
                await tokoDoc.set(form, {merge:true});
                setSomethingChange(false);
                enqueueSnackbar('Data Toko berhasil disimpan', {variant:'success'})
            } catch (e) {
                // console.log(e.message);
                enqueueSnackbar(e.message, {variant:'error'})
            }
            setSubmitting(false);
        }
    }


    if(loading){
        return <AppPageLoading />
    }
    return <div className={classes.pengaturanToko}>
        <form onSubmit={handleSubmit} noValidate>
            <TextField
            required
                id="nama"
                name="nama"
                label="Nama Toko"
                margin="normal"
                fullWidth
                onChange={handleChange}
                value={form.nama}
                helperText={error.nama}
                error={error.nama ? true : false}
                disabled={isSubmitting}

            />

            <TextField
            required

                id="alamat"
                name="alamat"
                label="Alamat Toko"
                margin="normal"
                onChange={handleChange}
                fullWidth
                multiline
                rowsMax={3}
                value={form.alamat}
                helperText={error.alamat}
                error={error.alamat ? true : false}
                disabled={isSubmitting}

            />

            <TextField
            required

                id="telepon"
                name="telepon"
                label="No Telepon Toko"
                margin="normal"
                fullWidth
                onChange={handleChange}

                value={form.telepon}
                helperText={error.telepon}
                error={error.telepon ? true : false}
                disabled={isSubmitting}

            />

            <TextField
            required

                id="website"
                name="website"
                label="Website Toko"
                margin="normal"
                fullWidth
                onChange={handleChange}

                value={form.website}
                helperText={error.website}
                error={error.website ? true : false}
                disabled={isSubmitting}

            />

            <Button
                type="submit"
                className={classes.actionButton}
                variant="contained"
                color="primary"
                // onClick = {sendEmailVerification}
                disabled={isSubmitting || !isSomethingChange}
            >Simpan</Button>
        </form>

        <Prompt
        when={isSomethingChange}
        message="Terdapat perubahan yang belum disimpan, apakah anda yakin ingin meninggalkan halaman"
        />
    </div>
}

export default Toko;