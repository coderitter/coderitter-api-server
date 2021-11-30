export class Adress {
    street: string
    houseNumber: string
    plz: string
    city: string
    country: string
    constructor(street: string, houseNumber: string, plz: string, city: string, country: string){
        this.street= street
        this.houseNumber =houseNumber
        this.plz = plz
        this.city = city
        this.country = country
    }

    toJson(){
        return {
            'street': this.street,
            'housenumber': this.houseNumber,
            'plz': this.plz,
            'city': this.city,
            'country': this.country
        }
    }
}

export default class Knight {

    id?: number
    name?: string
    adress?: Adress
   
    constructor(data?: Partial<Knight>) {
        Object.assign(this, data)
    }
}


  
  