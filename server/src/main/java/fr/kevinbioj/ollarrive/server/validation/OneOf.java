package fr.kevinbioj.ollarrive.server.validation;

import fr.kevinbioj.ollarrive.server.validation.validator.OneOfConstraintValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = OneOfConstraintValidator.class)
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface OneOf {

  String[] value();

  String message() default "{fr.kevinbioj.ollarrive.server.validation.OneOf}";

  Class<?>[] groups() default {};

  Class<? extends Payload>[] payload() default {};
}
