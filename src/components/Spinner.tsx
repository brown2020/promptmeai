const Spinner = () => (
    <div className="flex justify-center items-center h-full">
      <div className="relative w-24 h-24">
        {/* Outer Ring */}
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="w-20 h-20 border-8 border-t-8 border-gradient-r from-blue-500 via-purple-500 to-pink-500 border-solid rounded-full animate-spin border-t-transparent"></div>
        </div>
  
        {/* Inner Ring */}
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="w-16 h-16 border-4 border-t-4 border-gray-300 border-solid rounded-full animate-spin border-t-transparent"></div>
        </div>
  
        {/* Optional Glow Effect */}
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="w-24 h-24 border-4 border-blue-500 border-solid rounded-full animate-pulse border-opacity-20"></div>
        </div>
      </div>
    </div>
  );
  
  export default Spinner;
  