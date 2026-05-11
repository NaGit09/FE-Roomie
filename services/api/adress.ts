import axios from "axios";

const BASE_URL = "https://provinces.open-api.vn/api/";
export const getProvinces = async () => {
  const res = await axios(`${BASE_URL}p/`);

  return res.data;
};

export const getDistricts = async (provinceCode: number) => {
  const res = await axios(
    `${BASE_URL}p/${provinceCode}?depth=2`,
  );

  return res.data.districts;
};

export const getWards = async (districtCode: number) => {
  const res = await axios(
    `${BASE_URL}d/${districtCode}?depth=2`,
  );

  return res.data.wards;
};
