import BigNumber from "bignumber.js";
import { Toast } from "yugen-uikit";

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
    toastError("Please enter a valid amount");
    errorFree = false;
    return errorFree;
  }
  if (!new BigNumber(inputValue).isGreaterThan(0)) {
    toastError("Insuffiecint amount too low");
    errorFree = false;
    return errorFree;
  }
  if (!new BigNumber(inputValueInWei).isLessThanOrEqualTo(maxValue)) {
    toastError("Input amount too high");
    errorFree = false;
    return errorFree;
  }
  return errorFree;
};

export default inputValidator;
