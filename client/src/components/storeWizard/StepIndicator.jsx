export default function StepIndicator({ step, totalSteps }) {
  return (
    <div className="w-full">
      <p className="text-lg font-semibold text-gray-700">
        Step {step} of {totalSteps}
      </p>
      <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
}
