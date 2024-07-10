import { RadialTreeVisualization } from './radial-visualization';
import { SunburstVisualization } from './sun-burst-visualization';
import { BaseVisualization } from './base-visualization';

console.log('DependencyVisualizer module loaded');

export class DependencyVisualizer {
  private visualization: BaseVisualization;
  private selector: string;

  constructor(selector: string, type: 'radial' | 'sunburst' = 'radial') {
    console.log('DependencyVisualizer constructor called', { selector, type });
    this.selector = selector;
    this.visualization = this.createVisualization(type);
  }

  private createVisualization(type: 'radial' | 'sunburst'): BaseVisualization {
    console.log('Creating visualization', type);
    return type === 'radial'
      ? new RadialTreeVisualization(this.selector)
      : new SunburstVisualization(this.selector);
  }

  loadData(showDev: boolean = false, depth: number = 2) {
    console.log('loadData called', { showDev, depth });
    this.visualization.loadData(showDev, depth);
  }

  changeVisualizationType(type: 'radial' | 'sunburst') {
    console.log('Changing visualization type', type);
    const chartDiv = document.querySelector(this.selector) as HTMLElement;
    chartDiv.innerHTML = ''; // Clear the existing visualization
    this.visualization = this.createVisualization(type);
    this.loadData();
  }
}

export default DependencyVisualizer;

if (typeof window !== 'undefined') {
  (window as any).DependencyVisualizer = DependencyVisualizer;
  console.log('DependencyVisualizer set on window object');
}
