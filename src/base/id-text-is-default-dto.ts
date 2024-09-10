export interface IIdTextIsDefaultDto {
    id: number;
    name: string;
    isDefault: string;
}
export class IdTextIsDefaultDto implements IIdTextIsDefaultDto {
    id: number = 0;
    name: string = "";
    isDefault: string = "";
}
export interface IdTextLogoDto {
    id: number;
    name: string;
    logo: string; // Assuming `logo` is a string; adjust type if needed.
}

export interface IdTextDto {
    id: number;
    name: string;
}
