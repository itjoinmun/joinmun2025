"use server";
import { redirect } from "next/navigation";

const DontolPage = () => {
  redirect("registration/1");
};

export default DontolPage;
