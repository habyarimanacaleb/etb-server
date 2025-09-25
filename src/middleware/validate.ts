import { Request, Response, NextFunction } from "express";
import { validationResult, ValidationError, Result } from "express-validator";

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors: Result<ValidationError> = validationResult(req);

  if (!errors.isEmpty()) {
    // Only map ValidationError types that have `param`
    const formattedErrors = errors.array({ onlyFirstError: true }).map(err => {
      // Type guard to ensure err has 'param'
      if ("param" in err) {
        return { field: err.param, message: err.msg };
      }
      return { field: "unknown", message: err.msg };
    });

    return res.status(400).json({
      success: false,
      errors: formattedErrors,
    });
  }

  next();
};
