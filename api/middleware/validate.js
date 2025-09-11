import { errorHandler } from "../utils/error.util.js";

// Generic request-body validator. Takes a zod schema, returns Express
// middleware: on success, req.body is replaced with the PARSED result
// (so defaults/coercions from the schema actually apply downstream); on
// failure, responds 400 with the first validation error instead of
// letting bad input reach the controller/database at all.
export default function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const firstIssue = result.error.issues[0];
      return next(
        errorHandler(400, `${firstIssue.path.join(".")}: ${firstIssue.message}`)
      );
    }
    req.body = result.data;
    next();
  };
}
