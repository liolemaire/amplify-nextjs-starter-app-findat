"use server";

import { cookieBasedClient } from "@/utils/amplify-utils";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Schema } from "../../../amplify/data/resource";
import { uploadFromServer } from "@/utils/amplify-utils";
import * as cdk from 'aws-cdk-lib';
import { Amplify } from "aws-amplify";

export type FormState = {
  status: string;
  message:string;
  };


export async function onDeleteFile(id: string) {
  const { data, errors } = await cookieBasedClient.models.File.delete({
    id,
  });

  console.log("data deleted", data, errors);
  revalidatePath("/");
}

export async function createAction(previousState: FormState, formData: FormData) {

  const { data } = await cookieBasedClient.models.File.create({
    title: formData.get("title")?.toString() || "",
    path: formData.get("path")?.toString() || "",
  });
  
  try {
    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
    // if ((file instanceof File)) {

      return { status: "error", message: "Please select a file." };
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    await uploadFromServer(buffer, file.name);

    revalidatePath("/");
    return { status: "success", message: "File has been uploaded." };
  } catch (error) {
    return { status: "error", message: error instanceof Error ? error.message : "An error occurred." };
  }
}
