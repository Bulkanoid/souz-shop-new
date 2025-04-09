import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useProducts(type: "hits" | "new" | "recommended" = "hits") {
  // Проверяем, есть ли type, если нет — используем "hits"
  const validType = type || "hits";

  const { data, error, isLoading } = useSWR(`/api/products?type=${validType}`, fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 60000, // Обновлять товары каждые 60 секунд
  });

  return { products: data || [], isLoading, error };
}
