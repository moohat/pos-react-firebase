import {makeStyles} from '@material-ui/styles'


const useStyles = makeStyles (theme =>({
    title:{
        // color:theme.palette.primary.main
        textAlign: 'center',
        marginBottom: theme.spacing(3)
    },

    paper:{
        marginTop: theme.spacing(8),
        padding: theme.spacing(6)
    },
    buttons:{
        marginTop: theme.spacing(6)
    },
    forgotPassword:{
        marginTop: theme.spacing(3)
    },
    typography: {
        padding: theme.spacing(5),
        
      },
      buttonPopover:{
        marginTop: theme.spacing(8),
        marginLeft: theme.spacing(10),
        textAlign:'center',
        alignContent:'center',
        alignItems:'center'

      }
}))


export default useStyles;