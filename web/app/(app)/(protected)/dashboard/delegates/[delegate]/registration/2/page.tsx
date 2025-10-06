import MunForm from "@/modules/dashboard/delegates/registration/mun-form";
import { DelegateOptions } from "@/utils/helpers/delegates";
import { redirect } from "next/navigation";

const RegistrationBiodataPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ delegate: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  // Get current delegate slug
  const { delegate } = await params;
  // Get current index (for Delegate Team only)
  const index: number = parseInt((await searchParams).idx as string) || 0;

  // Skip this page for advisor or observer
  if (delegate === "advisor" || delegate === "observer") {
    redirect(`/dashboard/delegates/${delegate}/registration/3`);
  }

  return (
    <>
      <MunForm slug={delegate as DelegateOptions} index={index} />
    </>
  );
};

export default RegistrationBiodataPage;
