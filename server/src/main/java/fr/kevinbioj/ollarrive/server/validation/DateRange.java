package fr.kevinbioj.ollarrive.server.validation;

import fr.kevinbioj.ollarrive.server.validation.validator.DateRangeConstraintValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = DateRangeConstraintValidator.class)
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface DateRange {

  String minField();

  String maxField();

  String message() default "{fr.kevinbioj.ollarrive.server.validation.DateRange}";

  Class<?>[] groups() default {};

  Class<? extends Payload>[] payload() default {};
}
