import MedicalForm from "@/modules/dashboard/delegates/registration/medical-form";
import { DelegateOptions } from "@/utils/helpers/delegates";

const RegistrationMedicalPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  return (
    <>
      <MedicalForm slug={slug as DelegateOptions} />
    </>
  );
};

export default RegistrationMedicalPage;
