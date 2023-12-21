package fr.kevinbioj.ollarrive.server.validation.validator;

import fr.kevinbioj.ollarrive.server.validation.OneOf;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

public class OneOfConstraintValidator implements ConstraintValidator<OneOf, String>{

  private Set<String> values;

  // ---

  @Override
  public void initialize(OneOf constraintAnnotation) {
    values = Arrays.stream(constraintAnnotation.value()).collect(Collectors.toSet());
  }

  @Override
  public boolean isValid(String s, ConstraintValidatorContext constraintValidatorContext) {
    if (s == null)
      return true;
    return values.contains(s);
  }
}
