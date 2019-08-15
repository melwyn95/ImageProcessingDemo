import React from 'react';
import styles from '../styles/MainContent.module.css';

const MainContent = ({ children }: { children: React.ReactNode }) => (
    <div className={styles.mainContent}>{children}</div>
);

export default MainContent;