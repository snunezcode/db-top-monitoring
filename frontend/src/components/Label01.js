import {memo} from 'react';

const Metric = memo(({ value, title, fontSizeTitle = "11px", fontSizeValue = "22px", fontColorTitle = "#2ea597" }) => {

    return (
            <div>
                <span style={{"font-size": fontSizeValue, "font-weight": "900","font-family": "Lato" }}>
                    {value}
                </span>
                <br/>
                <span style={{"font-size": fontSizeTitle,"font-weight": "450","font-family": "Lato", "color": fontColorTitle }}>
                    {title}
                </span>
          
            </div>
           )
});

export default Metric

