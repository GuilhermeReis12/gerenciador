import React, { useState, useRef, useMemo } from 'react';
import JoditEditor from 'jodit-react';

interface SummerNoteProps {
  placeholder?: string;
  onChange?: (e: any) => void;
  value?: string;
}

const SummerNote: React.FC<SummerNoteProps> = ({ placeholder, onChange, value }) => {
  const editor = useRef(null);
  const [content, setContent] = useState<string>('');

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: placeholder || '',
      buttons: ['bold', 'italic', 'underline', 'strikethrough', '|'],
      uploader: {
        insertImageAsBase64URI: true,
        url: '/your-upload-url',
      }
    }),
    [placeholder]
  );

  const handleBlur = (newContent: string) => {
    setContent(newContent);
  };


  return (
    <div style={{ width: '100%' }}>
      <JoditEditor
        ref={editor}
        value={value || content}
        config={config}
        onBlur={handleBlur}
        onChange={(newContent: string) => {
          onChange && onChange(newContent);
        }}
      />
    </div>
  );
};

export default SummerNote;