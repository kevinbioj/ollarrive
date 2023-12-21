package fr.kevinbioj.ollarrive.server.business;

import java.util.Objects;
import lombok.EqualsAndHashCode;
import lombok.Getter;

@EqualsAndHashCode(callSuper = true)
@Getter
public abstract class AbstractBusinessException extends Exception {

  private final String code;
  private final String details;

  protected AbstractBusinessException(String code, String details) {
    super(code + ": " + details);
    this.code = Objects.requireNonNull(code);
    this.details = Objects.requireNonNull(details);
  }
}
