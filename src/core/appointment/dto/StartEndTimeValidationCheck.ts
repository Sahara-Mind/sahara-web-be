import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsEndTimeAfterStartTime', async: false })
class IsEndTimeAfterStartTimeConstraint
  implements ValidatorConstraintInterface
{
  validate(_: any, args: ValidationArguments) {
    const { startTime, endTime } = args.object as any;
    if (!startTime || !endTime) return true;

    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);

    const start = sh * 60 + sm;
    const end = eh * 60 + em;

    return end > start;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(_args: ValidationArguments) {
    return 'endTime must be after startTime';
  }
}

export function IsEndTimeAfterStartTime(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsEndTimeAfterStartTime',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsEndTimeAfterStartTimeConstraint,
    });
  };
}
