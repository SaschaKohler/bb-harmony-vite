import { useMemo, useState } from "react";
import { isWithinInterval, parseISO } from "date-fns";

interface DateFilter {
  startDate: Date | null;
  endDate: Date | null;
}

interface UseTableFilterOptions<T> {
  data: T[];
  filterFn: (
    item: T,
    filters: {
      searchValue: string;
      dateFilter: DateFilter;
    },
  ) => boolean;
}

export function useTableFilter<T>({
  data,
  filterFn,
}: UseTableFilterOptions<T>) {
  const [searchValue, setSearchValue] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>({
    startDate: null,
    endDate: null,
  });

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      filterFn(item, {
        searchValue,
        dateFilter,
      }),
    );
  }, [data, searchValue, dateFilter, filterFn]);

  return {
    searchValue,
    setSearchValue,
    dateFilter,
    setDateFilter,
    filteredData,
  };
}
