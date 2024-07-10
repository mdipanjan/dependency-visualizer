import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface Dependency {
  name: string;
  version: string;
  dependencies?: { [key: string]: Dependency };
}

export class DependencyAnalyzer {
  async getNestedDependencies(showDev: boolean = false, maxDepth: number = 4): Promise<Dependency> {
    try {
      const command = `npm list ${showDev ? '' : '--prod'} --json --depth=${maxDepth}`;
      const { stdout } = await execAsync(command);
      return JSON.parse(stdout);
    } catch (error) {
      console.error('Error executing npm list:', error);
      return {} as Dependency;
    }
  }

  convertToD3Format(npmListOutput: Dependency): any {
    const formatNode = (node: Dependency, name?: string): any => {
      return {
        name: name ? `${name}@${node.version}` : node.name,
        children: node.dependencies
          ? Object.entries(node.dependencies).map(([depName, depNode]) =>
              formatNode(depNode, depName),
            )
          : undefined,
        value: 1,
      };
    };

    return formatNode(npmListOutput);
  }
}
