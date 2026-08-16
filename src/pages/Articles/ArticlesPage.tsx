import { useMemo, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { DataTable, type Column } from '@/components/ui/DataTable';
import { SearchInput } from '@/components/ui/SearchInput';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { ArticleFormModal } from '@/components/articles/ArticleFormModal';
import { useDebounce } from '@/hooks/useDebounce';
import { useArticles, useDeleteArticle, useUpdateArticle } from '@/hooks/useArticles';
import { formatDate } from '@/utils/format';
import type { Article } from '@/types';

export function ArticlesPage() {
  const { data: articles, isLoading, isError, refetch } = useArticles();
  const updateArticle = useUpdateArticle();
  const deleteArticle = useDeleteArticle();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);
  const [statusFilter, setStatusFilter] = useState('');
  const [formState, setFormState] = useState<{ open: boolean; article: Article | null }>({
    open: false,
    article: null,
  });
  const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);

  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    return (articles ?? []).filter((a) => {
      const matchesSearch = !q || a.title.toLowerCase().includes(q);
      const matchesStatus =
        !statusFilter || (statusFilter === 'published' ? a.isPublished : !a.isPublished);
      return matchesSearch && matchesStatus;
    });
  }, [articles, debouncedSearch, statusFilter]);

  const columns: Column<Article>[] = [
    {
      key: 'title',
      header: 'Title',
      sortValue: (row) => row.title,
      render: (row) => <span className="font-medium text-slate-900">{row.title}</span>,
    },
    {
      key: 'category',
      header: 'Category',
      sortValue: (row) => row.category?.name ?? '',
      render: (row) => row.category?.name ?? '—',
    },
    {
      key: 'status',
      header: 'Status',
      sortValue: (row) => Number(row.isPublished),
      render: (row) => (
        <button
          type="button"
          onClick={() => updateArticle.mutate({ id: row.id, payload: { isPublished: !row.isPublished } })}
        >
          <Badge className={row.isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}>
            {row.isPublished ? 'Published' : 'Draft'}
          </Badge>
        </button>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created At',
      sortValue: (row) => row.createdAt,
      render: (row) => formatDate(row.createdAt),
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (row) => (
        <div className="flex justify-end gap-1">
          <button
            type="button"
            onClick={() => setFormState({ open: true, article: row })}
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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchInput
            placeholder="Search articles…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sm:max-w-xs"
          />
          <FilterDropdown
            label="Status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { label: 'Published', value: 'published' },
              { label: 'Draft', value: 'draft' },
            ]}
          />
        </div>
        <Button icon={<Plus className="h-4 w-4" />} onClick={() => setFormState({ open: true, article: null })}>
          Add article
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        emptyTitle="No articles found"
        emptyDescription="Create your first article."
      />

      <ArticleFormModal
        isOpen={formState.open}
        article={formState.article}
        onClose={() => setFormState({ open: false, article: null })}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete article"
        description={`This will permanently delete "${deleteTarget?.title}". This action cannot be undone.`}
        confirmLabel="Delete"
        isLoading={deleteArticle.isPending}
        onConfirm={() => {
          if (!deleteTarget) return;
          deleteArticle.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
