import { api } from "../lib/api-client";
import { QrCodeResponse } from "../types/qr.types";


export const generateQrCodes = async (
  quantity: number
): Promise<QrCodeResponse[]> => {
  const response = await api.post("/qr-code/generate", { quantity });

  return response.data?.data ?? response.data;
};

export const getAllQrCodes = async (): Promise<QrCodeResponse[]> => {
  const response = await api.get("/qr-code");

  return response.data?.data ?? response.data;
};

export const activateQrCode = async (
  code: string,
  payload: {
    language: string;
    carNumberPlate: string;
    name: string;
    contactNumber: string;
    emergencyDetails?: {
      emergencyContacts?: string[];
      bloodGroup?: string | null;
      healthInsuranceCompany?: string | null;
      notes?: string | null;
    };
  }
): Promise<QrCodeResponse> => {
  const response = await api.put(`/qrcode/${code}`, payload);

  return response.data?.data ?? response.data;
};