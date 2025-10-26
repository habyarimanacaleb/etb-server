"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const express_validator_1 = require("express-validator");
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
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
exports.validate = validate;
