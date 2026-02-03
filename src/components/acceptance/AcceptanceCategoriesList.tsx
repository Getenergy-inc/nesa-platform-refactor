import { Badge } from "@/components/ui/badge";
import { FolderOpen } from "lucide-react";

interface Category {
  category: string;
  subcategory: string;
  justification?: string;
}

interface AcceptanceCategoriesListProps {
  categories: Category[];
}

export function AcceptanceCategoriesList({ categories }: AcceptanceCategoriesListProps) {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground flex items-center gap-2">
        <FolderOpen className="h-5 w-5 text-primary" />
        Nominated Category(ies):
      </h3>
      
      <div className="space-y-3">
        {categories.map((cat, index) => (
          <div 
            key={index}
            className="bg-muted/50 rounded-lg p-4 border border-border/50"
          >
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                {cat.category}
              </Badge>
              <span className="text-muted-foreground">→</span>
              <Badge variant="outline">{cat.subcategory}</Badge>
            </div>
            {cat.justification && (
              <p className="text-sm text-muted-foreground italic line-clamp-2">
                "{cat.justification}"
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
