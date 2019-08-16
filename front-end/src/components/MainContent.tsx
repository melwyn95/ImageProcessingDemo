import React from 'react';
import styles from '../styles/components/MainContent.module.css';

const MainContent = ({ children }: { children: React.ReactNode }) => (
    <div className={styles.mainContent}>{children}</div>
);

export default MainContent;