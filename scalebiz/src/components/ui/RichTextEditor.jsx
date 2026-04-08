"use client";

import React, { useMemo, useRef } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import ImageResize from 'quill-image-resize-module-react';
import { uploadSingleImage } from '@/utils/upload';

// Register the image resize module with Quill
Quill.register('modules/imageResize', ImageResize);

const RichTextEditor = ({ content, onChange }) => {
  const quillRef = useRef(null);

  // Custom handler for the image upload button in the toolbar
  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        try {
          const { imageUrl } = await uploadSingleImage(file);
          const quill = quillRef.current.getEditor();
          const range = quill.getSelection(true);
          // Insert the uploaded image into the editor
          quill.insertEmbed(range.index, 'image', imageUrl);
        } catch (error) {
          console.error('Image upload failed for Quill editor:', error);
        }
      }
    };
  };

  // Configure the toolbar and image resize modules
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        [{ 'align': [] }],
        [{ 'color': [] }],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: imageHandler,
      },
    },
    imageResize: {
      parchment: Quill.import('parchment'),
      modules: ['Resize', 'DisplaySize', 'Toolbar']
    }
  }), []);

  return (
    <div className="bg-background">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={content}
        onChange={onChange}
        modules={modules}
        placeholder="Write your description here..."
      />
    </div>
  );
};

export default RichTextEditor;