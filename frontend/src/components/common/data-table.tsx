"use client";

import * as React from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, MoreHorizontal, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  className?: string;
  render?: (row: T) => React.ReactNode;
}

export interface RowAction<T> {
  label: string;
  icon?: React.ReactNode;
  onClick: (row: T) => void;
  variant?: "default" | "destructive";
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  actions?: RowAction<T>[];
  searchPlaceholder?: string;
  selectable?: boolean;
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  pageSize?: number;
  totalItems?: number;
  className?: string;
}

type SortDirection = "asc" | "desc" | null;

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  actions,
  searchPlaceholder = "Rechercher...",
  selectable = false,
  loading = false,
  emptyTitle = "Aucun resultat",
  emptyDescription = "Aucune donnee ne correspond a votre recherche.",
  pageSize = 10,
  totalItems,
  className,
}: DataTableProps<T>) {
  const [search, setSearch] = React.useState("");
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDir, setSortDir] = React.useState<SortDirection>(null);
  const [selectedRows, setSelectedRows] = React.useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = React.useState(1);

  const filteredData = React.useMemo(() => {
    let result = [...data];
    if (search) {
      const lower = search.toLowerCase();
      result = result.filter((row) =>
        Object.values(row).some(
          (val) => val !== null && val !== undefined && String(val).toLowerCase().includes(lower)
        )
      );
    }
    if (sortKey && sortDir) {
      result.sort((a, b) => {
        const aVal = String(a[sortKey] ?? "");
        const bVal = String(b[sortKey] ?? "");
        const cmp = aVal.localeCompare(bVal, "fr", { numeric: true });
        return sortDir === "asc" ? cmp : -cmp;
      });
    }
    return result;
  }, [data, search, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const total = totalItems ?? filteredData.length;

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : sortDir === "desc" ? null : "asc");
      if (sortDir === "desc") setSortKey(null);
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const toggleAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedData.map((_, i) => (currentPage - 1) * pageSize + i)));
    }
  };

  const toggleRow = (index: number) => {
    const newSet = new Set(selectedRows);
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      newSet.add(index);
    }
    setSelectedRows(newSet);
  };

  if (loading) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-72" />
        </div>
        <div className="rounded-xl border border-border">
          <div className="space-y-0">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border-b border-border last:border-0">
                {columns.map((_, j) => (
                  <Skeleton key={j} className="h-5 flex-1" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-10 rounded-lg border border-border bg-white pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          />
        </div>
        {selectedRows.size > 0 && (
          <span className="text-sm text-muted-foreground">
            {selectedRows.size} selectionne(s)
          </span>
        )}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              {selectable && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={paginatedData.length > 0 && selectedRows.size === paginatedData.length}
                    onCheckedChange={toggleAll}
                  />
                </TableHead>
              )}
              {columns.map((col) => (
                <TableHead key={col.key} className={col.className}>
                  {col.sortable ? (
                    <button
                      onClick={() => handleSort(col.key)}
                      className="flex items-center gap-1.5 hover:text-foreground transition-colors -ml-1 px-1 py-0.5 rounded"
                    >
                      {col.label}
                      {sortKey === col.key && sortDir === "asc" ? (
                        <ArrowUp className="h-3.5 w-3.5" />
                      ) : sortKey === col.key && sortDir === "desc" ? (
                        <ArrowDown className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
                      )}
                    </button>
                  ) : (
                    col.label
                  )}
                </TableHead>
              ))}
              {actions && actions.length > 0 && (
                <TableHead className="w-12">
                  <span className="sr-only">Actions</span>
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)}
                  className="h-40 text-center"
                >
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{emptyTitle}</p>
                    <p className="text-sm text-muted-foreground">{emptyDescription}</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, rowIdx) => {
                const globalIdx = (currentPage - 1) * pageSize + rowIdx;
                return (
                  <TableRow
                    key={rowIdx}
                    data-state={selectedRows.has(globalIdx) ? "selected" : undefined}
                  >
                    {selectable && (
                      <TableCell>
                        <Checkbox
                          checked={selectedRows.has(globalIdx)}
                          onCheckedChange={() => toggleRow(globalIdx)}
                        />
                      </TableCell>
                    )}
                    {columns.map((col) => (
                      <TableCell key={col.key} className={col.className}>
                        {col.render ? col.render(row) : String(row[col.key] ?? "")}
                      </TableCell>
                    ))}
                    {actions && actions.length > 0 && (
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {actions.map((action, actionIdx) => (
                              <DropdownMenuItem
                                key={actionIdx}
                                onClick={() => action.onClick(row)}
                                className={cn(
                                  "gap-2 cursor-pointer",
                                  action.variant === "destructive" && "text-error-500 focus:text-error-500"
                                )}
                              >
                                {action.icon}
                                {action.label}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Affichage {Math.min((currentPage - 1) * pageSize + 1, total)}-{Math.min(currentPage * pageSize, total)} sur {total}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
            let page: number;
            if (totalPages <= 5) {
              page = i + 1;
            } else if (currentPage <= 3) {
              page = i + 1;
            } else if (currentPage >= totalPages - 2) {
              page = totalPages - 4 + i;
            } else {
              page = currentPage - 2 + i;
            }
            return (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="w-8"
              >
                {page}
              </Button>
            );
          })}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
