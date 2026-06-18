export type StockConflict = {
  sku: string;
  availableStock: number;
};

// Extracts NestJS structured exceptions where the data payload is nested inside an inner message object wrapper.  e.g. (data.message.code)
const checkNestJSStructure = (payload: unknown): StockConflict | null => {
  if (!payload || typeof payload !== "object") return null;

  // Cast safely to look for the "message" object layer created by NestJS
  const raw = payload as Record<string, unknown>;

  if (raw.message && typeof raw.message === "object") {
    const innerMessage = raw.message as Record<string, unknown>;

    if (
      innerMessage.code === "INSUFFICIENT_STOCK" &&
      typeof innerMessage.sku === "string"
    ) {
      return {
        sku: innerMessage.sku,
        availableStock:
          typeof innerMessage.availableStock === "number"
            ? innerMessage.availableStock
            : 0,
      };
    }
  }

  return null;
};

// Error parser matching NestJS HTTP exception signatures
export const extractStockConflict = (error: unknown): StockConflict | null => {
  if (!error || typeof error !== "object") return null;

  // Check if the error object itself is the parsed response body
  const directCheck = checkNestJSStructure(error);
  if (directCheck) return directCheck;

  // Check custom ApiError "info" container payload
  if ("info" in error && error.info) {
    const infoCheck = checkNestJSStructure(error.info);
    if (infoCheck) return infoCheck;
  }

  // Check generic network client "data" payloads
  if ("data" in error && error.data) {
    const dataCheck = checkNestJSStructure(error.data);
    if (dataCheck) return dataCheck;
  }

  // Check Axios-style "response.data" payload wrappers
  if (
    "response" in error &&
    error.response &&
    typeof error.response === "object"
  ) {
    const AxiosResponse = error.response as Record<string, unknown>;
    if (AxiosResponse.data) {
      const axiosCheck = checkNestJSStructure(AxiosResponse.data);
      if (axiosCheck) return axiosCheck;
    }
  }

  return null;
};
