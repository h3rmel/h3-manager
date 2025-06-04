'use client';

import { useMemo, useState } from 'react';

import { AlertCircle, CheckCircle, Loader, Trash2, X } from 'lucide-react';

import { DeploymentsTable } from '@/components/deployments-table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { cn } from '@/lib/utils';
import { deleteDeployment, getDeployments } from '@/lib/vercel';

type Deployment = {
  id: string;
  url: string;
  state: string;
  createdAt: number;
  creator: string;
  target: string;
};

type SelectProjectProps = {
  projects: { id: string; name: string }[];
};

type DeletionStatus = {
  isDeleting: boolean;
  currentStep: number;
  totalSteps: number;
  currentDeployment?: string;
  completed: boolean;
  failed: boolean;
  error?: string;
};

export function SelectProject({ projects }: SelectProjectProps) {
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [selectedDeployments, setSelectedDeployments] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [deletionStatus, setDeletionStatus] = useState<DeletionStatus>({
    isDeleting: false,
    currentStep: 0,
    totalSteps: 0,
    completed: false,
    failed: false,
  });

  const handleProjectSelect = async (projectId: string) => {
    setSelectedProject(projectId);
    setSelectedDeployments([]);
    setLoading(true);
    setError('');

    try {
      const deploymentsData = await getDeployments(projectId);
      setDeployments(deploymentsData);
    } catch (err) {
      setError('Erro ao carregar deployments. Tente novamente.');
      console.error('Error fetching deployments:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDeployments = useMemo(() => {
    if (!startDate && !endDate) return deployments;

    return deployments.filter((deployment) => {
      const deploymentDate = new Date(deployment.createdAt);

      if (startDate && deploymentDate < startDate) return false;
      if (endDate && deploymentDate > endDate) return false;

      return true;
    });
  }, [deployments, startDate, endDate]);

  const clearFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const handleDeleteSelected = async () => {
    if (selectedDeployments.length === 0) return;

    setDeletionStatus({
      isDeleting: true,
      currentStep: 0,
      totalSteps: selectedDeployments.length,
      completed: false,
      failed: false,
    });

    for (let i = 0; i < selectedDeployments.length; i++) {
      const deploymentId = selectedDeployments[i];
      const deployment = deployments.find((d) => d.id === deploymentId);

      setDeletionStatus((prev) => ({
        ...prev,
        currentStep: i + 1,
        currentDeployment: deployment?.url || deploymentId,
      }));

      try {
        const result = await deleteDeployment(deploymentId);

        if (!result.success) {
          setDeletionStatus((prev) => ({
            ...prev,
            failed: true,
            error: result.error || 'Erro desconhecido',
            isDeleting: false,
          }));
          return;
        }

        // Remove o deployment da lista local
        setDeployments((prev) => prev.filter((d) => d.id !== deploymentId));

        // Aguarda 5 segundos antes da próxima exclusão (exceto na última)
        if (i < selectedDeployments.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
      } catch (err) {
        setDeletionStatus((prev) => ({
          ...prev,
          failed: true,
          error: err instanceof Error ? err.message : 'Erro desconhecido',
          isDeleting: false,
        }));
        return;
      }
    }

    // Processo concluído com sucesso
    setDeletionStatus((prev) => ({
      ...prev,
      completed: true,
      isDeleting: false,
    }));
    setSelectedDeployments([]);

    // Limpa a mensagem de sucesso após 5 segundos
    setTimeout(() => {
      setDeletionStatus({
        isDeleting: false,
        currentStep: 0,
        totalSteps: 0,
        completed: false,
        failed: false,
      });
    }, 5000);
  };

  const selectedProjectName = projects.find((p) => p.id === selectedProject)?.name;
  const hasActiveFilters = startDate || endDate;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-4">Gerenciador de Projetos</h1>
        <Select onValueChange={handleProjectSelect}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione um projeto" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedProject && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Deployments - {selectedProjectName}</h2>
            <div className="flex gap-2">
              {selectedDeployments.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteSelected}
                  disabled={deletionStatus.isDeleting}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Excluir Selecionados ({selectedDeployments.length})
                </Button>
              )}
              {hasActiveFilters && (
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Limpar filtros
                </Button>
              )}
            </div>
          </div>

          {/* Status da exclusão */}
          {(deletionStatus.isDeleting ||
            deletionStatus.completed ||
            deletionStatus.failed) && (
            <Alert
              className={`mb-4 ${
                deletionStatus.failed
                  ? 'border-red-500 bg-red-500/20'
                  : deletionStatus.completed
                    ? 'border-green-500 bg-green-500/20'
                    : 'border-blue-500 bg-blue-500/20'
              }`}
            >
              {deletionStatus.failed ? (
                <AlertCircle className="size-4 text-red-600" />
              ) : deletionStatus.completed ? (
                <CheckCircle className="size-4 text-green-600" />
              ) : (
                <Loader className="size-4 animate-spin text-blue-600" />
              )}
              <AlertDescription
                className={cn(
                  'w-full',
                  deletionStatus.failed
                    ? 'text-red-800'
                    : deletionStatus.completed
                      ? 'text-green-800'
                      : 'text-blue-800',
                )}
              >
                <p className="text-sm w-full">
                  {deletionStatus.failed
                    ? `Erro na exclusão: ${deletionStatus.error}`
                    : deletionStatus.completed
                      ? `${deletionStatus.totalSteps} deployment(s) excluído(s) com sucesso!`
                      : `Excluindo deployment ${deletionStatus.currentStep} de ${deletionStatus.totalSteps}: ${deletionStatus.currentDeployment}`}
                </p>
              </AlertDescription>
            </Alert>
          )}

          {/* Filtros de Data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 border rounded-lg bg-muted/50">
            <div>
              <label className="block text-sm font-medium mb-2">Data de início</label>
              <DatePicker
                date={startDate}
                onDateChange={setStartDate}
                placeholder="Selecionar data inicial"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Data de fim</label>
              <DatePicker
                date={endDate}
                onDateChange={setEndDate}
                placeholder="Selecionar data final"
              />
            </div>
          </div>

          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p className="mt-2 text-muted-foreground">Carregando deployments...</p>
            </div>
          )}

          {error && <div className="text-center py-8 text-red-600">{error}</div>}

          {!loading && !error && (
            <div>
              {hasActiveFilters && (
                <p className="text-sm text-muted-foreground mb-4">
                  Mostrando {filteredDeployments.length} de {deployments.length}{' '}
                  deployments
                </p>
              )}
              <DeploymentsTable
                deployments={filteredDeployments}
                selectedDeployments={selectedDeployments}
                onSelectionChange={setSelectedDeployments}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
