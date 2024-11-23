import React from 'react';
import styles from './maintenance.module.css'; // Import CSS module for styling

const SiteUnderMaintenance = () => {
    return (
        <div className={styles.maintenanceContainer}>
            <h1>Site Under Maintenance</h1>
            <p>We are currently performing scheduled maintenance. We apologize for the inconvenience and appreciate your patience.</p>
            <p>Please check back later.</p>
            <div className={styles.contactInfo}>
                <p>If you have any questions, feel free to <b>Whatsapp</b> us at 7505574391.</p>
            </div>
        </div>
    );
};

export default SiteUnderMaintenance;