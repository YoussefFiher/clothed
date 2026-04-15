import { User } from "./user.model";

export class Article {
        constructor(public id : number,
                public images: (File|string)[], 
                public title: string, 
                public type: string,
                public sous_type: string,
                public description : string,
                public statut : string,
                public user : User)
                
        {}

}