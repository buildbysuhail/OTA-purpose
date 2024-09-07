export interface IIdTextIsDefaultDto {
    id: number;
    text: string;
    isDefault: string;
}
export class IdTextIsDefaultDto implements IIdTextIsDefaultDto {
    id: number = 0;
    text: string = "";
    isDefault: string = "";
}
export interface IdTextLogoDto {
    id: number;
    text: string;
    logo: string; // Assuming `logo` is a string; adjust type if needed.
}

export interface IdTextDto {
    id: number;
    text: string;
}
