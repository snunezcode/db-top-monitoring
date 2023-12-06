import {memo} from 'react';

const cardObject = memo(({ width="100%", children }) => {

    return (
            <div>
                <table style={{"width":width, "padding": "1em"}}>
                    <tr>  
                        <td style={{"width":width, "padding": "1em", "border-radius": "10px", "border":  "3px solid" }}>
                            {children}
                        </td>
                    </tr>
                  </table>
                        
          
            </div>
           )
});

export default cardObject;

