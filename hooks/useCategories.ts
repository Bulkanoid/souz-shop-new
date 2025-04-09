import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useCategories() {
  const { data, error, isLoading, isValidating } = useSWR("/api/categories", fetcher, {
    revalidateOnFocus: false,
  });

  return { categories: data || [], isLoading: !data && isLoading, isValidating, error };
}
