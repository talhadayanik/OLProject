const BASE_URL = "https://localhost:7141";

class APICaller {
    async addParcel(parcel){
        const response = await fetch(`${BASE_URL}/api/Parcels`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                //'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(parcel)
        });

        const data = await response.json();

        return data
    }

    async getAllParcels(){
    
        const response = await fetch(`${BASE_URL}/api/Parcels`, {
          method: 'GET'
        });
    
        const data = await response.json();

        return data
    };

    async update(parcel){
        const response = await fetch(`${BASE_URL}/api/Parcels/${parcel.Id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                //'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(parcel)
        });

        return response
    }

    async delete(parcelId){
        const response = await fetch(`${BASE_URL}/api/Parcels/${parcelId}`, {
            method: 'DELETE'
        });

        return response
    }
}

export default new APICaller()







