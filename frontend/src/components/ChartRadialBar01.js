import Chart from 'react-apexcharts';

function ChartLine({ series, height, width, title, fontSizeTitle = "11px", fontSizeValue = "22px", fontColorTitle = "#C6C2C1", fontColorValue = "orange" }) {
    
    var options = {
          chart: {
            type: 'radialBar',
            foreColor: '#C6C2C1',
          },
          plotOptions: {
            radialBar: {
              hollow: {
                size: '70%',
              }
            },
          },
          labels: [title],
        };

    return (
            <div>
                <div style={{height:height, width:width}}>
                    <Chart options={options} series={series} type={"radialBar"} width={width} height={height} />
                </div>
            </div>
          
           );
}

export default ChartLine;
