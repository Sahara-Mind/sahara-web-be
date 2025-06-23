import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

// Helper function to convert HH:mm format to minutes
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export function IsEndTimeAfterStartTime(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isEndTimeAfterStartTime',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const appointment = args.object as any;
          const startTime = appointment.startTime;
          const endTime = appointment.endTime;

          if (!startTime || !endTime) {
            return false;
          }

          // Convert HH:mm format to minutes for comparison
          const startMinutes = timeToMinutes(startTime);
          const endMinutes = timeToMinutes(endTime);

          return endMinutes > startMinutes;
        },
        defaultMessage() {
          return 'endTime must be after startTime';
        },
      },
    });
  };
}
