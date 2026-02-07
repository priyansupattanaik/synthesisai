'use client';

import React from 'react';
import styles from './HoloSwitch.module.css';

interface HoloSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const HoloSwitch: React.FC<HoloSwitchProps> = ({ checked, onChange }) => {
  return (
    <div className={styles.toggleContainer}>
      <div className={styles.toggleWrap}>
        <input 
          className={styles.toggleInput} 
          id="holo-toggle" 
          type="checkbox" 
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <label className={styles.toggleTrack} htmlFor="holo-toggle">
          <div className={styles.trackLines}>
            <div className={styles.trackLine} />
          </div>
          <div className={styles.toggleThumb}>
            <div className={styles.thumbCore} />
            <div className={styles.thumbInner} />
            <div className={styles.thumbScan} />
            <div className={styles.thumbParticles}>
              <div className={styles.thumbParticle} />
              <div className={styles.thumbParticle} />
              <div className={styles.thumbParticle} />
              <div className={styles.thumbParticle} />
              <div className={styles.thumbParticle} />
            </div>
          </div>
          <div className={styles.toggleData}>
            <div className={`${styles.dataText} ${styles.offText}`}>OFF</div>
            <div className={`${styles.dataText} ${styles.onText}`}>ON</div>
            <div className={`${styles.statusIndicator} ${styles.offIndicator}`} />
            <div className={`${styles.statusIndicator} ${styles.onIndicator}`} />
          </div>
          <div className={styles.energyRings}>
            <div className={styles.energyRing} />
            <div className={styles.energyRing} />
            <div className={styles.energyRing} />
          </div>
          <div className={styles.interfaceLines}>
            <div className={styles.interfaceLine} />
            <div className={styles.interfaceLine} />
            <div className={styles.interfaceLine} />
            <div className={styles.interfaceLine} />
            <div className={styles.interfaceLine} />
            <div className={styles.interfaceLine} />
          </div>
          <div className={styles.toggleReflection} />
          <div className={styles.holoGlow} />
        </label>
      </div>
    </div>
  );
}

export default HoloSwitch;
