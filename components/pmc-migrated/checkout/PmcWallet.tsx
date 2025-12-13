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
    <div className="align-items-center p-3 p-xl-4 w-100 border rounded-3 bg-white mb-3 mt-4">
      <h5 className="d-block mb-2">Packmycode Wallet</h5>
      <div className="form-check">
        <input
          className="form-check-input"
          type="radio"
          name="paymentMethod"
          id="pay-by-pmc-wallet"
          onChange={payByPmc}
        />
        <label className="form-check-label" htmlFor="pay-by-pmc-wallet">
          <span>
            Total Price: ${payAbleAmount.toFixed(2)} Use from your wallet, Your balance $
            {actualBalance.toFixed(2)}
          </span>
        </label>
      </div>
    </div>
  );
}
