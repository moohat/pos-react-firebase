import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({    
   fab: {
       position: 'absolute',
       right: theme.spacing(2),
       bottom: theme.spacing(2)
   }
}))

export default useStyles;