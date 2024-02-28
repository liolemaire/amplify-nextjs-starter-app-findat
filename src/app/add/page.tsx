import React from "react";
import { createFile } from "@/app/_actions/actions";

const AddFile = () => {
  return (
    <div>
      <form
        action={createFile}
        className="p-4 flex flex-col items-center gap-4"
      >
        <input
          type="text"
          name="title"
          id="title"
          placeholder="Title"
          className="border border-gray-200 text-gray-900 block p-2 rounded-lg"
        />
        <button type="submit" className="text-white bg-teal-600 rounded p-4">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddFile;
