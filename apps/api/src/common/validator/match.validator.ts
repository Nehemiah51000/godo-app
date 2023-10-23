import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  equals,
  registerDecorator,
  ValidationOptions,
} from 'class-validator'

export const Match =
  <T>(property: keyof T, options?: ValidationOptions) =>
  (object: unknown, propertyName: string) =>
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      constraints: [property],
      validator: MatchConstraint,
    })

@ValidatorConstraint({ name: 'Match' })
export class MatchConstraint implements ValidatorConstraintInterface {
  validate(value: any, validationArguments?: ValidationArguments): boolean {
    const dto = validationArguments.object
    const property = validationArguments.constraints.at(0)
    const compareWithValue = dto[property]

    return equals(compareWithValue, value)
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    const [propertyNameToCompare] = validationArguments.constraints

    return `${validationArguments.property} and ${propertyNameToCompare} does not match`
  }
}
