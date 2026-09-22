type SpinnerProps = {
  message?: string;
};

const Spinner = ({ message }: SpinnerProps) => {
  return (
    <div
      className="text-center flex flex-col gap-4 items-center justify-center"
      role="status"
      aria-label={message || "Loading"}
    >
      <div
        className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#4B5563] dark:border-[#D1D5DB] border-solid"
        aria-hidden
      />
      {message && (
        <p className="mt-4 text-md font-medium text-[#374151] dark:text-[#E5E7EB]">
          {message}
        </p>
      )}
    </div>
  );
};

export default Spinner;
