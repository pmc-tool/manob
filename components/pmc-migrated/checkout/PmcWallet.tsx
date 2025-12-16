// PmcWallet - migrated from PMC
"use client";

interface IProps {
  payAbleAmount: number;
  actualBalance: number;
  handlePaymentMethodChange: (type: string, value: boolean) => void;
}

export default function PmcWallet({
  payAbleAmount,
  actualBalance,
  handlePaymentMethodChange,
}: IProps) {
  const payByPmc = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    handlePaymentMethodChange("PMCWALLET", checked);
  };

  return (
    <div className="items-center p-3 xl:p-4 w-full border rounded-lg bg-white mb-3 mt-4">
      <h5 className="block mb-2 font-semibold">Packmycode Wallet</h5>
      <div className="flex items-center gap-2">
        <input
          className="w-4 h-4 accent-primary cursor-pointer"
          type="radio"
          name="paymentMethod"
          id="pay-by-pmc-wallet"
          onChange={payByPmc}
        />
        <label className="text-sm" htmlFor="pay-by-pmc-wallet">
          <span>
            Total Price: ${payAbleAmount.toFixed(2)} Use from your wallet, Your balance $
            {actualBalance.toFixed(2)}
          </span>
        </label>
      </div>
    </div>
  );
}
