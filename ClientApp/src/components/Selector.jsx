import React from 'react'

const Selector = () => {
    return(
        <div>
            <select>
                <option value="Point">Point</option>
                <option value="LineString">LineString</option>
                <option value="Polygon">Polygon</option>
                <option value="Circle">Circle</option>
            </select>
        </div>
    );
}

export default Selector;