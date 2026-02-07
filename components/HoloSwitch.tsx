'use client';

import React, { useId } from 'react';
import styles from './HoloSwitch.module.css';

interface HoloSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const HoloSwitch: React.FC<HoloSwitchProps> = ({ checked, onChange }) => {
  // useId generates a unique ID that stays the same between server and client
  const uniqueId = useId();
  const inputId = `holo-toggle-${uniqueId}`;

  return (
    // Stop propagation so clicking the switch doesn't trigger the row click
    <div className={styles.toggleContainer} onClick={(e) => e.stopPropagation()}>
      <div className={styles.toggleWrap}>
        <input 
          className={styles.toggleInput} 
          id={inputId} 
          type="checkbox" 
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <label className={styles.toggleTrack} htmlFor={inputId}>
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