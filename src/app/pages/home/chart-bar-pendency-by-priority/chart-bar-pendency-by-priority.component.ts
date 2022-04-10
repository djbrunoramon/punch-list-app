import {Component, OnInit, ViewChild} from '@angular/core';
import {ChartConfiguration, ChartType} from "chart.js";
import {BaseChartDirective} from "ng2-charts";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {PendencyService} from "../../services/pendency.service";
import {IPendencyByPriority} from "../../model/pendency-by-priority";
import {PendencyStatus} from "../../model/pendency-status";

@Component({
  selector: 'app-chart-bar-pendency-by-priority',
  templateUrl: './chart-bar-pendency-by-priority.component.html',
  styleUrls: ['./chart-bar-pendency-by-priority.component.scss']
})
export class ChartBarPendencyByPriorityComponent implements OnInit {

  public pendencyPriorityLabel: string[] = [];
  public pendencyQuantity: number[] = [];
  public pendencyDataSet: any[] = [];
  public pendencyByPriority: IPendencyByPriority[] = [];

  constructor(private pendencyService: PendencyService) {
  }

  ngOnInit() {
    this.getChart();
    this.chart?.update();

  }

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public getChart() {
    this.pendencyService.getPendencyByPriority(1, PendencyStatus.OPEN).subscribe(data => {
      this.pendencyByPriority = data;

      data.forEach(d => {
        this.pendencyPriorityLabel.push(d.priority);
        this.pendencyQuantity.push(d.quantity);
        this.pendencyDataSet.push({data: d.quantity, label: d.priority});
      });
    });
    this.chart?.update();
  }

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 0
      }
    },
    plugins: {
      legend: {
        display: true,
      },
      // datalabels: {
      //   anchor: 'end',
      //   align: 'end'
      // }
    }
  };
  public barChartType: ChartType = 'bar';
  public barChartPlugins = [
    ChartDataLabels
  ];

  public barChartData = {
    labels: this.pendencyPriorityLabel,
    datasets: this.pendencyDataSet
  };
}
