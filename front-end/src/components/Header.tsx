import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import HeaderTitle from './HeaderTitle';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minHeight: '50px'
    },
  }),
);

type HeaderProps = {
    title: string
}

const Header = ({ title = '' }: HeaderProps) => {
    const { root } = useStyles();
    return (<AppBar classes={{ root }}>
        <HeaderTitle title={title}/>
    </AppBar>);
};

export default Header;