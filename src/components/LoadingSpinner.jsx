import { Loader2 } from "lucide-react";

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg flex items-center gap-4">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="text-lg font-medium">Creating your course...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
