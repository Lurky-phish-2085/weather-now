import axios from "axios";
import { WMOCodeInterpretation } from "../types";

const API_URL = `${import.meta.env.BASE_URL}/wmo-code-interpretations.json`;

export const getWMOCodeInterpretation = async (
  code: number
): Promise<WMOCodeInterpretation> => {
  const response = await axios.get(API_URL);
  const interpretations = response.data;
  const interpretation: WMOCodeInterpretation | undefined =
    interpretations[String(code)];

  if (!interpretation) {
    throw new Error(`Code: ${code} cannot be interpreted.`);
  }

  return interpretation;
};
