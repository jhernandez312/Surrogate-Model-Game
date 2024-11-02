import { ChangeEvent } from 'react';
import styles from './FormInput.module.css';

interface FormInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  id?: string; // optional ID
  type?: string; // input type, default to "text"
  placeholder?: string; // optional placeholder
  step?: string;
}

export default function FormInput({
  label,
  name,
  value,
  onChange,
  readOnly = false,
  id,
  type = "text",
  placeholder,
}: FormInputProps) {
  return (
    <div className={`${styles.formGroup} mb-4`}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        placeholder={placeholder}
        className={`mt-1 p-2 block w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:text-gray-200 ${styles.input}`}
      />
    </div>
  );
}
