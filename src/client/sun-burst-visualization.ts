import * as d3 from 'd3';
import { BaseVisualization } from './base-visualization';

export class SunburstVisualization extends BaseVisualization {
  private partition: d3.PartitionLayout<any>;

  constructor(selector: string) {
    super(selector);
    this.partition = d3.partition<any>().size([2 * Math.PI, Math.min(this.width, this.height) / 2]);
  }

  render(data: any) {
    console.log('Rendering Sunburst visualization');
    this.g.selectAll('*').remove();

    const root = d3
      .hierarchy(data)
      .sum((d: any) => d.value)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    this.partition(root);

    const arc = d3
      .arc<d3.HierarchyRectangularNode<any>>()
      .startAngle(d => d.x0)
      .endAngle(d => d.x1)
      .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
      .padRadius(this.height / 2)
      .innerRadius(d => d.y0)
      .outerRadius(d => d.y1 - 1);

    this.g
      .selectAll('path')
      .data(root.descendants().slice(1))
      .enter()
      .append('path')
      .attr('fill', (d: any) => this.color(d.data.name))
      .attr('d', arc as any)
      .append('title')
      .text(
        (d: any) =>
          `${d
            .ancestors()
            .map((d: any) => d.data.name)
            .reverse()
            .join('/')}\n${d.value}`,
      );

    this.g
      .selectAll('text')
      .data(
        root
          .descendants()
          .slice(1)
          .filter((d: any) => d.y0 >= 1 && ((d.y0 + d.y1) / 2) * (d.x1 - d.x0) > 10),
      )
      .enter()
      .append('text')
      .attr('transform', (d: any) => {
        const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI;
        const y = (d.y0 + d.y1) / 2;
        return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
      })
      .attr('dy', '0.35em')
      .text((d: any) => d.data.name)
      .style('font-size', '10px');
  }
}
