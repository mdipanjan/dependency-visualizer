import * as d3 from 'd3';

export abstract class BaseVisualization {
  protected svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
  protected width: number;
  protected height: number;
  protected g: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  protected color: d3.ScaleOrdinal<string, string>;

  constructor(selector: string) {
    const chartDiv = document.querySelector(selector) as HTMLElement;
    this.width = chartDiv.clientWidth;
    this.height = chartDiv.clientHeight;

    this.svg = d3
      .select(selector)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    this.g = this.svg
      .append('g')
      .attr('transform', `translate(${this.width / 2},${this.height / 2})`);

    this.color = d3.scaleOrdinal(d3.schemeCategory10);

    const zoom = d3.zoom().on('zoom', event => {
      this.g.attr('transform', event.transform);
    });
    this.svg.call(zoom as any);
  }

  abstract render(data: any): void;

  loadData(showDev: boolean = false, depth: number = 2) {
    d3.json(`/data?showDev=${showDev}&depth=${depth}`)
      .then(data => {
        console.log('Received data:', data);
        this.render(data);
      })
      .catch(error => {
        console.error('Error loading data:', error);
      });
  }

  getSvgNode(): SVGSVGElement | null {
    return this.svg.node();
  }
}
