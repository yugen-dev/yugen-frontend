import BigNumber from "bignumber.js";
import { Toast } from "cryption-uikit";

const inputValidator = (
  toastError: {
    (title: string, description?: string): { payload: Toast; type: string };
    (title: string, description?: string): { payload: Toast; type: string };
    (arg0: string): void;
  },
  inputValue: string,
  maxValue: BigNumber
) => {
  const inputValueInWei = new BigNumber(inputValue).times(
    new BigNumber(10).pow(18)
  );

  let errorFree = true;
  if (!/^\d+\.?\d*$/.test(inputValue)) {
    toastError("Please enter a valid number");
    errorFree = false;
    return errorFree;
  }
  if (!new BigNumber(inputValue).isGreaterThan(0)) {
    toastError("Insuffiecint amount to burn");
    errorFree = false;
    return errorFree;
  }
  if (!new BigNumber(inputValueInWei).isLessThanOrEqualTo(maxValue)) {
    toastError("Cannot burn more than what you have");
    errorFree = false;
    return errorFree;
  }
  return errorFree;
};

export default inputValidator;
