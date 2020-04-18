import React, { useState } from 'react';


//material-ui
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import useStyles from './styles/grid';

//page Coponent
import AddDialog from './add';

function GridProduk(){
    const classes = useStyles();

    const [openAddDialog, setOpenAddDialog] = useState(false);
    return <><h1>Halaman Grid Produk</h1>
    <Fab
    color="primary"
    className={classes.fab}
    onClick ={(e) => {
        setOpenAddDialog(true);
    }}
    >
        <AddIcon />

    </Fab>

    <AddDialog 
    open={openAddDialog}
    handleClose={() =>{
        setOpenAddDialog(false);
    }}
    />
    </>
}

export default GridProduk;