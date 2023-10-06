import React from "react";

const ParcelItem = ({parcel}) => {
    return(
        <div className='general'>
            <h2>&nbsp;&nbsp;&nbsp;&nbsp;{parcel.district}, {parcel.neighborhood}, {parcel.province} </h2>
        </div>
    );
}

export default ParcelItem;



