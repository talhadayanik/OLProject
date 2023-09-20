import React from "react";

const ParcelItem = ({parcel}) => {
    return(
        <div className='general'>
            <h2>{parcel.province} {parcel.district} {parcel.neighborhood}</h2>
        </div>
    );
}

export default ParcelItem;