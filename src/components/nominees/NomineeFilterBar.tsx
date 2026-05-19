import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type NomineeSort = "votes" | "newest" | "name";

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  country: string;
  onCountryChange: (v: string) => void;
  countries: string[];
  sort: NomineeSort;
  onSortChange: (v: NomineeSort) => void;
  onClear: () => void;
  hasFilters: boolean;
  totalCount: number;
}

export function NomineeFilterBar({
  search, onSearchChange, country, onCountryChange, countries,
  sort, onSortChange, onClear, hasFilters, totalCount,
}: Props) {
  return (
    <div className="bg-charcoal-light/60 border border-gold/10 rounded-2xl p-4 mb-6 space-y-3">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gold" />
          <Input
            placeholder="Search nominees..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-charcoal border-gold/20 text-ivory placeholder:text-ivory/40 focus:border-gold"
          />
        </div>

        <Select value={country} onValueChange={onCountryChange}>
          <SelectTrigger className="w-full md:w-52 bg-charcoal border-gold/20 text-ivory">
            <Filter className="h-4 w-4 mr-2 text-gold/80" />
            <SelectValue placeholder="All Countries" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            {countries.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={(v) => onSortChange(v as NomineeSort)}>
          <SelectTrigger className="w-full md:w-44 bg-charcoal border-gold/20 text-ivory">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="votes">Most Voted</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="name">A → Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between text-xs text-ivory/60">
        <span>{totalCount.toLocaleString()} nominees</span>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={onClear} className="text-gold hover:text-gold/80 h-7 gap-1">
            <X className="w-3 h-3" /> Clear
          </Button>
        )}
      </div>
    </div>
  );
}
