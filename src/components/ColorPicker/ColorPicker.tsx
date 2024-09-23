import { ChangeEvent, useCallback, useEffect, useState } from 'react';

type ColorPickerProps = {
  initialValue: string;
  onChange?: (color: string) => void;
  onBlur?: (color: string) => void;
};

export const ColorPicker = ({ initialValue, onChange, onBlur }: ColorPickerProps) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue, setValue]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const color = e.target.value;
      setValue(color);
      onChange?.(color);
    },
    [setValue, onChange],
  );

  const handleBlur = useCallback(() => {
    onBlur?.(value);
  }, [value, onBlur]);

  return <input type="color" value={value} onChange={handleChange} onBlur={() => handleBlur()} />;
};
