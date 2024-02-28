import { cookieBasedClient, isAuthenticated } from "@/utils/amplify-utils";
import { revalidatePath } from "next/cache";
import React from "react";
import { Schema } from "../../../../amplify/data/resource";

const Files = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;

  const isSignedIn = await isAuthenticated();
  const { data: file } = await cookieBasedClient.models.File.get(
    {
      id: params.id,
    },
    {
      authMode: "apiKey",
      selectionSet: ["id", "title"],
    }
  );


  return (
    <div className="flex flex-col items-center p-4 gap-4">
      <h1 className="text-2xl font-bold">File Information:</h1>
      <div className="border rounded w-1/2 m-auto bg-gray-200 p-4 ">
        <h2>Title: {file.title}</h2>
      </div>

    </div>
  );
};

export default Files;
