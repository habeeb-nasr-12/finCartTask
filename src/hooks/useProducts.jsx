import { useQuery } from "@tanstack/react-query";
import { removeUndefinedValues } from "../lib/utils";
import { api } from "../services/api";

const getProducts = async (params) => {
  params = removeUndefinedValues(params);
  params = new URLSearchParams(params).toString();
  const res = await api.get(`products?${params}`);
  return res;
};

export const useProducts = (params) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
  });
};
