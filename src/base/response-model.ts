
    export class ResponseModel<T> {
        public items: T[];
        public isOk: boolean;
        public item: T;
        public message: string;
        public messages: string[];

        constructor(data: T) {
            this.item = data;
            this.items = [];
            this.isOk = true;
            this.message = '';
            this.messages = [''];
        }
    }

        export class ResponseModelWithValidation<T, V> extends ResponseModel<T> {
            public validations: V | null;

            constructor(data: T, validation: V) {
                super(data);
                this.validations = validation;
            }
        }
