export interface SingleForeignCallParam {
	Single: string;
}

export interface ArrayForeignCallParam {
	Array: string[];
}

export type ForeignCallParam = SingleForeignCallParam | ArrayForeignCallParam;

export interface ForeignCallResult {
	values: ForeignCallParam[];
}
