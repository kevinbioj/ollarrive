package fr.kevinbioj.ollarrive.server.controller;

import fr.kevinbioj.ollarrive.server.business.AbstractBusinessException;
import fr.kevinbioj.ollarrive.server.business.ValidationException;
import fr.kevinbioj.ollarrive.server.business.deliverer.exception.DelivererNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ErrorControllerAdvice {

  @ExceptionHandler(ValidationException.class)
  public ProblemDetail validationException(ValidationException exception) {
    var pd = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, exception.getDetails());
    pd.setTitle(exception.getCode());
    pd.setProperty("violations", exception.getViolations());
    return pd;
  }
}
