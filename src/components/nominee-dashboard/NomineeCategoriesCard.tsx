import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FolderOpen, Trophy, CheckCircle } from "lucide-react";

interface Category {
  category: string;
  subcategory: string;
  justification?: string;
  status?: "pending" | "nrc_verified" | "jury_review";
}

interface NomineeCategoriesCardProps {
  categories: Category[];
}

export function NomineeCategoriesCard({ categories }: NomineeCategoriesCardProps) {
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "nrc_verified":
        return (
          <Badge variant="default" className="bg-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            NRC Verified
          </Badge>
        );
      case "jury_review":
        return (
          <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
            <Trophy className="h-3 w-3 mr-1" />
            In Jury Review
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">Pending Review</Badge>
        );
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FolderOpen className="h-5 w-5 text-primary" />
          Your Nomination Categories
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {categories.length === 0 ? (
          <p className="text-muted-foreground text-sm">No categories assigned yet.</p>
        ) : (
          categories.map((cat, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 space-y-3 hover:border-primary/50 transition-colors"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      {cat.category}
                    </Badge>
                    <span className="text-muted-foreground">→</span>
                    <span className="font-medium">{cat.subcategory}</span>
                  </div>
                </div>
                {getStatusBadge(cat.status)}
              </div>
              
              {cat.justification && (
                <div className="bg-muted/50 rounded-md p-3 border-l-2 border-primary">
                  <p className="text-xs text-muted-foreground mb-1">Recognition Reason:</p>
                  <p className="text-sm italic">"{cat.justification}"</p>
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
