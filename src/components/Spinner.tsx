type SpinnerProps = {
  message?: string;
};

const Spinner = ({ message }: SpinnerProps) => {
  return (
    <div className="text-center flex flex-col gap-4 items-center justify-center">
      {/* Spinner */}
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-gray-500 border-solid" />

      {/* Message */}
      {message && (
        <p className="mt-4 text-md font-medium text-gray-500 animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

export default Spinner;
