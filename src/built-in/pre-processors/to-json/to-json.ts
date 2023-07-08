import { PreProcessor } from "../../../transform";

/**
 * A pre-processor that converts JSON string into object
 */
export const toJson: PreProcessor = (data: string): object => JSON.parse(data);

export default toJson;
