import Chart from 'react-apexcharts';

function ChartBar({series,height, width="100%", title }) {

    var   data = [{
              data: series.data
            }];

    var options = {
              chart: {
                type: 'bar',
                height: height,
                foreColor: '#9e9b9a',
                zoom: {
                  enabled: false
                },
                animations: {
                    enabled: false,
                },
                dynamicAnimation :
                {
                    enabled: true,
                },
                toolbar: {
                    show: false,
                 }
              },
              plotOptions: {
                bar: {
                  borderRadius: 4,
                  horizontal: true,
                }
              },
              dataLabels: {
                enabled: false
              },
              xaxis: {
                categories: series.categories,
              },
              grid: {
                show: false,
                yaxis: {
                    lines: {
                        show: false
                    }
                },
                xaxis: {
                            lines: {
                                show: false
                            }
                        }
              },
              tooltip: {
                    theme: "dark",
              },
              dataLabels: {
                enabled: true,
                style: {
                    fontSize: '11px',
                    fontWeight: 'bold',
                },
              },
            
    };
    
    
    return (
            <div>
                <Chart options={options} series={data} type="bar" width={width} height={height} />
            </div>
           );
}

export default ChartBar;
