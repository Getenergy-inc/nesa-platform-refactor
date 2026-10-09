import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { PAGE_SEQUENCE } from "@/config/page-sequence";
import { ALL_CATEGORIES, GROUP_META } from "@/config/awardCategories";

/**
 * Global navbar search.
 * - Icon button (always visible) + Cmd/Ctrl+K shortcut
 * - Searches all public pages + every award category by finalName/slug
 */
export function NavSearch({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const sections = useMemo(() => {
    const bySection: Record<string, typeof PAGE_SEQUENCE> = {};
    for (const p of PAGE_SEQUENCE) {
      const key = p.section ?? "Pages";
      (bySection[key] ||= []).push(p);
    }
    return bySection;
  }, []);

  const go = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Search the site"
        onClick={() => setOpen(true)}
        className={
          "h-8 w-8 xl:h-9 xl:w-9 text-white/90 hover:text-gold hover:bg-gold/10 " +
          (className ?? "")
        }
      >
        <Search className="h-4 w-4" />
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search pages, awards, categories…" />
        <CommandList>
          <CommandEmpty>No matches. Try “nominate”, “vote”, “icon”…</CommandEmpty>

          {Object.entries(sections).map(([section, pages]) => (
            <CommandGroup key={section} heading={section}>
              {pages.map((p) => (
                <CommandItem
                  key={p.path}
                  value={`${p.label} ${p.path}`}
                  onSelect={() => go(p.path)}
                >
                  <span>{p.label}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{p.path}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}

          <CommandSeparator />

          <CommandGroup heading="Award Categories">
            {ALL_CATEGORIES.map((c) => (
              <CommandItem
                key={c.slug}
                value={`${c.finalName} ${c.slug} ${GROUP_META[c.group]?.label ?? ""}`}
                onSelect={() => go(c.url)}
              >
                <span className="truncate">{c.finalName}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {GROUP_META[c.group]?.label}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

export default NavSearch;
