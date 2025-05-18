import BiodataForm from "@/modules/dashboard/delegates/registration/biodata-form";
import MunForm from "@/modules/dashboard/delegates/registration/mun-form";
import { DelegateOptions } from "@/utils/helpers/delegates";

const RegistrationBiodataPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  return (
    <>
      <MunForm slug={slug as DelegateOptions} />
    </>
  );
};

export default RegistrationBiodataPage;
