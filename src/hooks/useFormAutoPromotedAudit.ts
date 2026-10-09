import { useQuery } from "@tanstack/react-query";
import {
  queryFormAutoPromoted,
  type FormAutoPromotedFilter,
} from "@/lib/audit/queryFormAutoPromoted";

export function useFormAutoPromotedAudit(filter: FormAutoPromotedFilter = {}) {
  return useQuery({
    queryKey: ["form-auto-promoted-audit", filter],
    queryFn: () => queryFormAutoPromoted(filter),
    staleTime: 1000 * 60 * 2, // 2 min
    refetchInterval: 1000 * 60 * 5, // auto-refresh every 5 min
  });
}
