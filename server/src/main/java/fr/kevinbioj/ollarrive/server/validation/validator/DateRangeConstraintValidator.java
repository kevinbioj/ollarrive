package fr.kevinbioj.ollarrive.server.validation.validator;

import fr.kevinbioj.ollarrive.server.validation.DateRange;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.time.OffsetDateTime;
import org.springframework.beans.BeanWrapperImpl;

public class DateRangeConstraintValidator implements ConstraintValidator<DateRange, Object> {

  private String minDateTimeField;
  private String maxDateTimeField;

  // ---

  @Override
  public void initialize(DateRange constraintAnnotation) {
    minDateTimeField = constraintAnnotation.minField();
    maxDateTimeField = constraintAnnotation.maxField();
  }

  @Override
  public boolean isValid(Object source,
      ConstraintValidatorContext context) {
    OffsetDateTime minDateTime = (OffsetDateTime) new BeanWrapperImpl(source).getPropertyValue(
        minDateTimeField);
    OffsetDateTime maxDateTime = (OffsetDateTime) new BeanWrapperImpl(source).getPropertyValue(
        maxDateTimeField);
    if (minDateTime == null || maxDateTime == null) {
      return false;
    }
    return minDateTime.isBefore(maxDateTime);
  }
}
