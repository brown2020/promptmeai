type SpinnerProps = {
  message?: string;
};

const Spinner = ({ message }: SpinnerProps) => {
  return (
    <div className="text-center flex flex-col gap-4 items-center justify-center">
      {/* Spinner */}
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-gray-500 dark:border-[#EEE]/[0.5] border-solid" />

      {/* Message */}
      {message && (
        <p className="mt-4 text-md font-medium text-gray-500 dark:text-[#EEE]/[0.8] animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

export default Spinner;
