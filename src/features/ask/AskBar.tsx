import type { FormEvent, RefObject } from "react";

import { CloseIcon, SearchIcon, SendIcon } from "../../components/icons";

interface AskBarProps {
  value: string;
  disabled: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onClear: () => void;
}

export default function AskBar({ value, disabled, inputRef, onChange, onSubmit, onClear }: AskBarProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form className="ask-bar" onSubmit={handleSubmit}>
      <SearchIcon className="ask-bar-icon" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        maxLength={500}
        placeholder="Tanyakan sesuatu tentang UU PDP..."
        aria-label="Pertanyaan"
        onChange={(event) => onChange(event.target.value)}
      />
      {value.length > 0 && (
        <button type="button" className="ask-bar-clear" aria-label="Hapus pertanyaan" onClick={onClear}>
          <CloseIcon />
        </button>
      )}
      <button type="submit" className="btn-primary ask-bar-submit" disabled={disabled || value.trim().length < 3}>
        Analisis Pasal
        <SendIcon />
      </button>
    </form>
  );
}
