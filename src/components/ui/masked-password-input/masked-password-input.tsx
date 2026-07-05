import { ClipboardEvent, FC, KeyboardEvent } from 'react';
import { Input } from '@zlden/react-developer-burger-ui-components';

type TMaskedPasswordInputProps = {
  value: string;
  name: string;
  setValue: (value: string) => void;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  placeholder?: string;
};

const getNextValue = (
  value: string,
  input: HTMLInputElement,
  insertedValue: string
) => {
  const start = input.selectionStart ?? value.length;
  const end = input.selectionEnd ?? value.length;
  return `${value.slice(0, start)}${insertedValue}${value.slice(end)}`;
};

export const MaskedPasswordInput: FC<TMaskedPasswordInputProps> = ({
  value,
  name,
  setValue,
  visible,
  setVisible,
  placeholder = 'Пароль'
}) => {
  const displayedValue = visible ? value : '*'.repeat(value.length);

  const handleHiddenKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (visible || e.ctrlKey || e.metaKey || e.altKey) {
      return;
    }

    const input = e.currentTarget;

    if (e.key === 'Backspace') {
      e.preventDefault();
      const start = input.selectionStart ?? value.length;
      const end = input.selectionEnd ?? value.length;

      if (start !== end) {
        setValue(`${value.slice(0, start)}${value.slice(end)}`);
      } else if (start > 0) {
        setValue(`${value.slice(0, start - 1)}${value.slice(start)}`);
      }
      return;
    }

    if (e.key === 'Delete') {
      e.preventDefault();
      const start = input.selectionStart ?? value.length;
      const end = input.selectionEnd ?? value.length;

      if (start !== end) {
        setValue(`${value.slice(0, start)}${value.slice(end)}`);
      } else {
        setValue(`${value.slice(0, start)}${value.slice(start + 1)}`);
      }
      return;
    }

    if (e.key.length === 1) {
      e.preventDefault();
      setValue(getNextValue(value, input, e.key));
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    if (visible) {
      return;
    }

    e.preventDefault();
    setValue(
      getNextValue(value, e.currentTarget, e.clipboardData.getData('text'))
    );
  };

  return (
    <Input
      type='text'
      placeholder={placeholder}
      onChange={(e) => visible && setValue(e.target.value)}
      onKeyDown={handleHiddenKeyDown}
      onPaste={handlePaste}
      value={displayedValue}
      name={name}
      error={false}
      errorText=''
      size='default'
      icon={visible ? 'HideIcon' : 'ShowIcon'}
      onIconClick={() => setVisible(!visible)}
      autoComplete='current-password'
    />
  );
};
