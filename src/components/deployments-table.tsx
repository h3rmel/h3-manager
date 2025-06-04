import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type Deployment = {
  id: string;
  url: string;
  state: string;
  createdAt: number;
  creator: string;
  target: string;
};

type DeploymentsTableProps = {
  deployments: Deployment[];
  selectedDeployments: string[];
  onSelectionChange: (selectedIds: string[]) => void;
};

export function DeploymentsTable({
  deployments,
  selectedDeployments,
  onSelectionChange,
}: DeploymentsTableProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusVariant = (state: string) => {
    switch (state.toLowerCase()) {
      case 'ready':
        return 'success';
      case 'error':
        return 'destructive';
      case 'building':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(deployments.map((d) => d.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectDeployment = (deploymentId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedDeployments, deploymentId]);
    } else {
      onSelectionChange(selectedDeployments.filter((id) => id !== deploymentId));
    }
  };

  const isAllSelected =
    deployments.length > 0 && selectedDeployments.length === deployments.length;

  if (deployments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum deploy encontrado para este projeto.
      </div>
    );
  }

  return (
    <div className="w-full border rounded-md bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={handleSelectAll}
                aria-label="Selecionar todos"
              />
            </TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Target</TableHead>
            <TableHead>Criador</TableHead>
            <TableHead>Data</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deployments.map((deployment) => (
            <TableRow key={deployment.id}>
              <TableCell>
                <Checkbox
                  checked={selectedDeployments.includes(deployment.id)}
                  onCheckedChange={(checked) =>
                    handleSelectDeployment(deployment.id, checked as boolean)
                  }
                  aria-label={`Selecionar deployment ${deployment.url}`}
                />
              </TableCell>
              <TableCell>
                <a
                  href={`https://${deployment.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline truncate block max-w-[200px]"
                >
                  {deployment.url}
                </a>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(deployment.state)}>
                  {deployment.state}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {deployment.target}
                </Badge>
              </TableCell>
              <TableCell>{deployment.creator}</TableCell>
              <TableCell>{formatDate(deployment.createdAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
