const SettingsScreen = () => {
  return (
    <div className="w-screen h-screen bg-white flex justify-center">
      <div className="bg-[#F5F5F5] w-full rounded-lg flex justify-center m-6 p-8">
        <div className="max-w-[896px] w-full bg-white rounded-xl shadow px-[16px] py-[12px] flex flex-col gap-[12px]">
          <h2 className="font-medium text-[20px]">Account Settings</h2>
          <div className="border rounded-md p-4">
            <div>
              <span>Usage Credits: 1000</span>
              <div>
                <button>Buy 10,000 Credits</button>
                <p>
                  You can either buy credits or add your own API keys bellow.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
