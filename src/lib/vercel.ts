import { Vercel } from '@vercel/sdk';

const vercel = new Vercel({
  bearerToken: 'ag0PKligdGn7gzC1DvQlDEm8',
});

export async function getProjects() {
  const result = await vercel.projects.getProjects({});

  const projects = result.projects.map((project) => ({
    id: project.id,
    name: project.name,
  }));

  return projects;
}

export async function getDeployments(projectId: string) {
  const result = await vercel.deployments.getDeployments({
    projectId: projectId,
    limit: 100,
  });

  const deployments = result.deployments.map((deployment) => ({
    id: deployment.uid,
    url: deployment.url || '',
    state: deployment.state || 'unknown',
    createdAt: deployment.createdAt || Date.now(),
    creator: deployment.creator?.username || 'Unknown',
    target: deployment.target || 'production',
  }));

  return deployments;
}

export async function deleteDeployment(deploymentId: string) {
  try {
    await vercel.deployments.deleteDeployment({
      id: deploymentId,
    });
    return { success: true };
  } catch (error) {
    console.error('Error deleting deployment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
