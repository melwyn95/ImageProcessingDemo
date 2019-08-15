import React from 'react';
import Typography from '@material-ui/core/Typography';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      lineHeight: 3
    },
  }),
);

const HeaderTitle = ({ title }: { title: React.ReactNode }) => {
    const classes = useStyles();
    return (<Typography variant='h6' className={classes.title}>{title}</Typography>);
};

export default HeaderTitle;