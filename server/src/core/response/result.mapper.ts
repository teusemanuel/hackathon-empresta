import {JsonMapper, JsonMapperMethods} from "@tsed/json-mapper";
import {Outcome} from "../repository/outcome";
import {ResultModel, ResultModelArray} from "./result.model";

@JsonMapper(ResultModel, ResultModelArray)
export class ResultMapper implements JsonMapperMethods {
	deserialize<T>(data: T): ResultModel<T> {
		return data instanceof Outcome ? ResultModel.successOutcome(data) : ResultModel.success(data);
	}

	serialize<T>(data: ResultModel<T>): unknown {
		return data instanceof ResultModel ? data?.result : data;
	}
}
