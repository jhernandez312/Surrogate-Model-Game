import { ChangeEvent } from 'react';
import styles from './FormInput.module.css';

interface FormInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
}

export default function FormInput({
  label,
  name,
  value,
  onChange,
  readOnly = false,
}: FormInputProps) {
  return (
    <div className={styles.formGroup}>
      <label>{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        className={styles.input}
      />
    </div>
  );
}
