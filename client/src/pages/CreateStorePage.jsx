import { useState } from "react";
import { Button, Alert } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import useStoreApi from "../hooks/useStore";
import LoadingModal from "../components/global/spinners/LoadingModal";
import StepIndicator from "../components/storeWizard/StepIndicator";
import Step1StoreInfo from "../components/storeWizard/Step1StoreInfo";
import Step2Media from "../components/storeWizard/Step2Media";
import Step3Plan from "../components/storeWizard/Step3Plan";
import Step4Payment from "../components/storeWizard/Step4Payment";
import Step5Preview from "../components/storeWizard/Step5Preview";
import step1 from "../assets/images/step1.svg";
import step2 from "../assets/images/step2.svg";
import step3 from "../assets/images/step3.svg";
import step4 from "../assets/images/step4.svg";
import step5 from "../assets/images/step5.svg";

export default function CreateStorePage({ user }) {
  const { loading, error, createStore } = useStoreApi();
  const navigate = useNavigate();
  const imageArr= [step1,step2,step3,step4,step5]
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    user_id: user.id,
    storeName: "",
    description: "",
    category: "",
    file: null,
    banner: null,
    plan: "individual",
    paymentMethod: "",
    accountNumber: "",
  });

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setErrors({...error, [field]: ""})
  };
  // Validation logic
  const validateStep = () => {
    let newErrors = {};
    if (step === 1) {
      if (!formData.storeName.trim()) newErrors.storeName = "Store name is required";
      if (!formData.description.trim()) newErrors.description = "Description is required";
      if (!formData.category) newErrors.category = "Select a category";
    } else if (step === 2) {
      if (!formData.file) newErrors.file = "Please upload a store logo";
      if (!formData.banner) newErrors.banner = "Please upload a store banner"
    }
      else if(step === 4){
      if (!formData.paymentMethod) newErrors.paymentMethod = "Select a payment method";
      if (!formData.accountNumber.trim()) newErrors.accountNumber = "Enter your account number";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const nextStep = () => {if(validateStep())setStep((s) => s + 1)};
  const prevStep = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    if (validateStep()) {
      const payload = new FormData();

      // Append all fields
      Object.keys(formData).forEach((key) => {
        payload.append(key, formData[key]);
      });

      console.log("Submitting data:", formData);

      const newStore = await createStore(payload);

      console.log(newStore);
      if (!error || newStore) navigate("/store/dashboard");
    }
  };

  return (
    <div className="flex flex-col-reverse md:flex-row w-screen justify-evenly min-h-[500px] mx-auto gap-8 p-6 mb-4">
      <LoadingModal show={loading} message="Creating store..." />

      {/* Left: Form */}
      <div className="md:w-1/2 lg:w-[40%]">
        {step === 1 && <Step1StoreInfo formData={formData} onChange={handleChange} errors={errors} />}
        {step === 2 && <Step2Media formData={formData} onChange={handleChange} errors={errors}  />}
        {step === 3 && <Step3Plan formData={formData} onChange={handleChange} />}
        {step === 4 && <Step4Payment formData={formData} onChange={handleChange} errors={errors}  />}
        {step === 5 && <Step5Preview formData={formData} />}

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          {step > 1 && (
            <Button color="gray" onClick={prevStep}>
              Back
            </Button>
          )}
          {step < 5 ? (
            <Button onClick={nextStep}>Next</Button>
          ) : (
            <Button color="success" onClick={handleSubmit}>
              Create Store
            </Button>
          )}
        </div>

        {error && (
          <Alert color="failure" className="mt-4">
            <span>{error}</span>
          </Alert>
        )}
      </div>

      {/* Right: Step indicator + Illustration */}
      <div className="flex flex-col items-center justify-between bg-gray-50 rounded-xl p-6 md:w-1/2 lg:w-[40%]">
        <StepIndicator step={step} totalSteps={5}/>
        <img
          src={imageArr[step-1]}
          alt="Step illustration"
          className="hidden md:flex mt-6 w-3/4"
        />
      </div>
    </div>
  );
}
