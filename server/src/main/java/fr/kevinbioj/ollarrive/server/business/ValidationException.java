package fr.kevinbioj.ollarrive.server.business;

import jakarta.validation.ConstraintViolation;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import lombok.EqualsAndHashCode;
import lombok.Getter;

@EqualsAndHashCode(callSuper = true)
@Getter
public class ValidationException extends AbstractBusinessException {

  private final List<String> violations;

  public <T> ValidationException(Set<ConstraintViolation<T>> violations) {
    super("VALIDATION_ERROR",
        String.format("%d error%s found in the supplied payload.", violations.size(),
            violations.size() > 1 ? "s were" : " was"));
    this.violations = Objects.requireNonNull(violations)
        .stream().map(ConstraintViolation::getMessage).toList();
  }
}
