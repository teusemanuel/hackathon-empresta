import { SelectQueryBuilder } from "typeorm";
import { Outcome } from "../../repository/outcome";
import { PageInfo } from "../../repository/page-info";

export class QueryUtils {
	static async paginated<T>(queryBuilder: SelectQueryBuilder<T>, pageIndex = 0, pageSize = 25): Promise<Outcome<T[]>> {
		const page = new PageInfo();
		const result = await queryBuilder
			.skip(pageSize * pageIndex)
			.take(pageSize)
			.getMany();
		page.pageIndex = pageIndex;
		page.pageSize = result.length;
		page.length = await queryBuilder.getCount();

		return Outcome.ResultPaginated(result, page);
	}
}
