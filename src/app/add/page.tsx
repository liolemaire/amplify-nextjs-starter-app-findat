'use client';
import React from "react";
import { createFile, createAction } from "@/app/_actions/actions";
import { SubmitButton } from "./submit-button";
import { useFormState } from "react-dom";

const initialState = {
  message: '',
  status: ''
}

const AddFile = () => {
  const [state, formAction] = useFormState(createFile, initialState);

  return (
    <div>
      <form
        action={createAction}
        className="p-4 flex flex-col items-center gap-4"
      >
        <input
          type="text"
          name="title"
          id="title"
          placeholder="Title"
          className="border border-gray-200 text-gray-900 block p-2 rounded-lg"
        />
        <input
          type="text"
          name="path"
          id="path"
          placeholder="path"
          className="border border-gray-200 text-gray-900 block p-2 rounded-lg"
        />
        <input type="file" id="file" name="file" accept="images/*" />
                
        <SubmitButton />
      </form>
      {state?.status && (
        <div className={`state-message ${state?.status}`}>
          {state?.message}
        </div>
      )}
    </div>
  );
};

export default AddFile;
