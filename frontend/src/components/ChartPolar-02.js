import {memo, useEffect, useState} from 'react';
import Chart from 'react-apexcharts';

const ChartComponent = memo(({ series, labels, title="", height="350px", width="100%"}) => {      
          
           
            var parsedSeries=JSON.parse(series);

            var options = {
              chart: {
                type: 'polarArea',
                foreColor: '#9e9b9a',
                zoom: {
                    enabled: true,
                },            
              },
              title: {
                text : title,
                align: "right",
                show: false,
                style: {
                  fontSize:  '14px',
                  fontWeight:  'bold',
                  fontFamily:  "Lato",
                  color : "#2ea597"
                }
                
              },
              theme: {
                palette : "palette2",
                monochrome: {
                  enabled: true
                }
              },
              labels: JSON.parse(labels),
              stroke: {
                colors: ['#fff']
              },
              fill: {
                opacity: 0.8
              },
              /*
              legend: {
                    show: true,
                    showForSingleSeries: true,
                    fontSize: '11px',
                    fontFamily: 'Lato',
              },*/
              legend: {
                show: true,
                showForSingleSeries: true,
                fontSize: '12px',
                fontFamily: 'Lato',
                formatter: function(seriesName, opts) {                  
                    const value = parsedSeries[opts.seriesIndex];
                    if (value == undefined){
                      return `${seriesName}`;
                    }
                    else {                        
                        const formattedValue = formatValue(value);                        
                        return `${seriesName} (${formattedValue})`;
                  }
                }
            },          
              responsive: [{
                breakpoint: 480,
                options: {
                  legend: {
                    position: 'bottom'
                  }
                }
              }],
              yaxis: {
                 tickAmount: 3,
                 axisTicks: {
                      show: true,
                 },
                 axisBorder: {
                      show: true,
                      color: '#78909C',
                      offsetX: 0,
                      offsetY: 0
                 },
                 min : 0,
                 labels : {
                            formatter: function(val, index) {
                                        
                                        if(val === 0) return '0';
                                        if(val < 1000) return parseFloat(val).toFixed(1);
                                        
                                        var k = 1000,
                                        sizes = ['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'],
                                        i = Math.floor(Math.log(val) / Math.log(k));
                                        return parseFloat((val / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
        
                                        },    
                            style: {
                                  fontSize: '11px',
                                  fontFamily: 'Lato',
                             },
                 },
              }
            };
            
            const formatValue = (val) => {
              if (val === 0) return '0';
              if (val < 1000) return parseFloat(val).toFixed(1);
              
              var k = 1000,
              sizes = ['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'],
              i = Math.floor(Math.log(val) / Math.log(k));
              return parseFloat((val / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
          };

    return (
            <div>
                <Chart options={options} series={JSON.parse(series)} type="polarArea" height={height} width={width} />
            </div>
           );
});

export default ChartComponent;
