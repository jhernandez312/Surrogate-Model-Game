import { ChangeEvent } from 'react';
import styles from './FormInput.module.css';

interface FormSelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: string[]; // Array of options for the select
  id?: string; // optional ID
}

export default function FormSelect({
  label,
  name,
  value,
  onChange,
  options,
  id,
}: FormSelectProps) {
  return (
    <div className={`${styles.formGroup} mb-4`}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={`mt-1 p-2 block w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:text-gray-200 ${styles.select}`}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
