import { useMemo, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { SearchInput } from '@/components/ui/SearchInput';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { CategoryFormModal } from '@/components/categories/CategoryFormModal';
import { useDebounce } from '@/hooks/useDebounce';
import { useCategories, useDeleteCategory } from '@/hooks/useCategories';
import type { Category } from '@/types';

export function CategoriesPage() {
  const { data: categories, isLoading, isError, refetch } = useCategories();
  const deleteCategory = useDeleteCategory();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);
  const [formState, setFormState] = useState<{ open: boolean; category: Category | null }>({
    open: false,
    category: null,
  });
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    return (categories ?? []).filter((c) => !q || c.name.toLowerCase().includes(q));
  }, [categories, debouncedSearch]);

  const columns: Column<Category>[] = [
    {
      key: 'name',
      header: 'Name',
      sortValue: (row) => row.name,
      render: (row) => <span className="font-medium text-slate-900">{row.name}</span>,
    },
    { key: 'slug', header: 'Slug', sortValue: (row) => row.slug, render: (row) => row.slug },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (row) => (
        <div className="flex justify-end gap-1">
          <button
            type="button"
            onClick={() => setFormState({ open: true, category: row })}
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(row)}
            className="rounded-md p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          placeholder="Search categories…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <Button icon={<Plus className="h-4 w-4" />} onClick={() => setFormState({ open: true, category: null })}>
          Add category
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        emptyTitle="No categories found"
        emptyDescription="Add a category to get started."
      />

      <CategoryFormModal
        isOpen={formState.open}
        category={formState.category}
        onClose={() => setFormState({ open: false, category: null })}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete category"
        description={`This will permanently delete "${deleteTarget?.name}". Articles using it will lose their category.`}
        confirmLabel="Delete"
        isLoading={deleteCategory.isPending}
        onConfirm={() => {
          if (!deleteTarget) return;
          deleteCategory.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
