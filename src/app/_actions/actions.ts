"use server";

import { cookieBasedClient } from "@/utils/amplify-utils";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Schema } from "../../../amplify/data/resource";


export async function onDeleteFile(id: string) {
  const { data, errors } = await cookieBasedClient.models.File.delete({
    id,
  });

  console.log("data deleted", data, errors);
  revalidatePath("/");
}

export async function createFile(formData: FormData) {
  const { data } = await cookieBasedClient.models.File.create({
    title: formData.get("title")?.toString() || "",
  });
  console.log("create File data", data);
  redirect("/");
}
