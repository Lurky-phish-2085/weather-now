import axios from "axios";
import { CountryData } from "../types";

const API_URL = `${import.meta.env.BASE_URL}/countries.json`;

export const getCountryData = async (
  countryName: string
): Promise<CountryData> => {
  const response = await axios.get(API_URL);
  const countries: CountryData[] = response.data;

  const retrievedCountry: CountryData | undefined = countries.find(
    (country) => country.name === countryName || country.code === countryName
  );

  if (!retrievedCountry) {
    throw new Error(`${countryName} is not found.`);
  }

  return retrievedCountry;
};

export const getCapitalCityOf = async (
  countryName: string
): Promise<string> => {
  const country = await getCountryData(countryName).catch((error) => {
    console.log(error);
    throw new Error(error);
  });

  return country.capitalCity;
};

export const getCountryAbbrOf = async (
  countryName: string
): Promise<string> => {
  const country = await getCountryData(countryName).catch((error) => {
    console.log(error);
    throw new Error(error);
  });

  return country.code;
};
