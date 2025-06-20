// validatorResolver.ts
import Validator,{Rules} from "validatorjs";
Validator.useLang('es');
import { Resolver } from "react-hook-form";

type Schema = Parameters<any>[1];

export const validatorResolver =
  (rules: Schema, customMessages: Record<string, string> = {}, customNames: Record<string, string> = {} ): Resolver<any> =>
  async (values) => {
    const validation = new Validator(values, rules, customMessages);
    if(customNames){
        validation.setAttributeNames(customNames);
    }

    if (validation.passes()) {
      return {
        values,
        errors: {},
      };
    }

    const errors = Object.entries(validation.errors.all()).reduce((acc, [field, messages]) => {
      acc[field] = {
        type: "validation",
        message: Array.isArray(messages) ? messages[0] : messages,
      };
      return acc;
    }, {} as Record<string, any>);

    return {
      values: {},
      errors,
    };
  };
