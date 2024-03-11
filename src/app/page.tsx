import File from "@/components/File";
import { cookieBasedClient, isAuthenticated } from "@/utils/amplify-utils";
import { onDeleteFile } from "./_actions/actions";

export default async function Home() {
  const { data: files } = await cookieBasedClient.models.File?.list({
    selectionSet: ["title", "id", "path"],
    authMode: "apiKey",
  });

  // console.log("files", files);

  return (
    <main className="flex flex-col items-center justify-between p-24 w-1/2 m-auto">
      <h1 className="text-2xl pb-10">List Of All Titles</h1>
      {files?.map(async (file, idx) => (
        <File
          onDelete={onDeleteFile}
          file={file}
          key={idx}
          isSignedIn={await isAuthenticated()}
        />
      ))}
    </main>
  );
}
