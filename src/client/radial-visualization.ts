import * as d3 from 'd3';
import { BaseVisualization } from './base-visualization';

export class RadialTreeVisualization extends BaseVisualization {
  private tree: d3.TreeLayout<any>;

  constructor(selector: string) {
    super(selector);
    this.tree = d3.tree().size([2 * Math.PI, Math.min(this.width, this.height) / 2 - 100]);
  }

  render(data: any) {
    this.g.selectAll('*').remove();

    const root = d3.hierarchy(data);
    this.tree(root);

    const link = this.g
      .selectAll('.link')
      .data(root.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr(
        'd',
        d3
          .linkRadial()
          .angle((d: any) => d.x)
          .radius((d: any) => d.y) as any,
      );

    const node = this.g
      .selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr(
        'transform',
        (d: any) => `
        rotate(${(d.x * 180) / Math.PI - 90})
        translate(${d.y},0)
      `,
      );

    node
      .append('circle')
      .attr('r', 4)
      .style('fill', (d: any) => this.color(d.data.name));

    node
      .append('text')
      .attr('dy', '0.31em')
      .attr('x', (d: any) => (d.x < Math.PI ? 6 : -6))
      .attr('text-anchor', (d: any) => (d.x < Math.PI ? 'start' : 'end'))
      .attr('transform', (d: any) => (d.x >= Math.PI ? 'rotate(180)' : null))
      .text((d: any) => d.data.name)
      .style('font-size', '10px');
  }
}
