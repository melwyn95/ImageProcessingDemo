import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
        margin: theme.spacing(1)
    },
    input: {
        display: 'none',
    },
    formBody: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        marginTop: '100px'
    },
    imageHide: {
        display: 'none'
    },
    imageShow: {
        display: 'flex',
        flexDirection: 'column'
    },
    linearProgressRoot: {
        width: '60%',
        margin: '30px'
    },
    defaultMessageClassName: {
        margin: 20,
        color: 'blue'
    },
  }),
);

export default useStyles;