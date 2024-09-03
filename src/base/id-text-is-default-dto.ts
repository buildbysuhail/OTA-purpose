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