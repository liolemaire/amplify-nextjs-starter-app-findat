"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Schema } from "../../amplify/data/resource";

const File = ({
  file,
  onDelete,
  isSignedIn,
}: {
  file: Pick<Schema["File"], "title" | "id">;
  onDelete: (id: string) => void;
  isSignedIn: boolean;
}) => {
  const router = useRouter();
  const onDetail = () => {
    router.push(`files/${file.id}`);
  };
  return (
    <div className="border bg-gray-100 w-full p-4 rounded flex justify-between ">
      <button onClick={onDetail}>
        <div className="flex gap-2">
          <div>Title:</div>
          <div>{file.title}</div>
        </div>
      </button>
      <input type="hidden" name="id" id="id" value={file.id} />
      {isSignedIn ? (
        <button
          className="text-red-500 cursor-pointer"
          onClick={() => onDelete(file.id)}
        >
          X
        </button>
      ) : null}
    </div>
  );
};

export default File;
