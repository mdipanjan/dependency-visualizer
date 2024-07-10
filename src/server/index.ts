import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { DependencyAnalyzer } from './dependency-analyzer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createServer(port: number = 3000) {
  const app = express();
  const analyzer = new DependencyAnalyzer();

  app.use(express.static(path.join(__dirname, '../../public')));

  app.get('/data', async (req, res) => {
    const showDev = req.query.showDev === 'true';
    const depth = parseInt(req.query.depth as string) || 4;

    const dependencyTree = await analyzer.getNestedDependencies(showDev, depth);
    const d3Data = analyzer.convertToD3Format(dependencyTree);
    res.json(d3Data);
  });

  return app.listen(port, () => {
    console.log(`Dependency Visualizer server running on http://localhost:${port}`);
  });
}

createServer();

export { DependencyAnalyzer } from './dependency-analyzer.js';
export { DependencyVisualizer } from '../client/index.js';
