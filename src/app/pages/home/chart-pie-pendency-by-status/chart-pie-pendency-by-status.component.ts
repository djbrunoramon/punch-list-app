import {Component, OnInit, ViewChild} from '@angular/core';
import {BaseChartDirective} from "ng2-charts";
import {ChartConfiguration, ChartData, ChartType} from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {PendencyService} from "../../services/pendency.service";
import {PendencyByStatus} from "../../model/pendency-by-status";

@Component({
  selector: 'app-chart-pie-pendency-by-status',
  templateUrl: './chart-pie-pendency-by-status.component.html',
  styleUrls: ['./chart-pie-pendency-by-status.component.scss']
})
export class ChartPiePendencyByStatusComponent implements OnInit {

  public pendencyLabel: string[] = [];
  public pendencyQuantity: number[] = [];
  public pendencyByStatus: PendencyByStatus[] = [];

  constructor(private pendencyService: PendencyService) {
  }

  ngOnInit() {
    this.pendencyService.getPendencyByStatus(1).subscribe(data => {
      data.map(f => {
        this.pendencyLabel.push(f.label);
        this.pendencyQuantity.push(f.quantity);

      })
      this.chart?.update();
    });
  }

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  // Pie
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      datalabels: {
        formatter: (value, ctx) => {
          if (ctx.chart.data.labels) {
            return ctx.chart.data.labels[ctx.dataIndex];
          }
        },
      },
    }
  };
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: this.pendencyLabel,
    datasets: [{
      data: this.pendencyQuantity
    }]
  };
  public pieChartType: ChartType = 'pie';
  public pieChartPlugins = [ChartDataLabels];
}
