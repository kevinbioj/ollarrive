package fr.kevinbioj.ollarrive.server.business.deliverer.exception;

import fr.kevinbioj.ollarrive.server.business.AbstractBusinessException;
import java.util.UUID;

public class DelivererNotFoundException extends AbstractBusinessException {

  public DelivererNotFoundException(UUID id) {
    super("DELIVERER_NOT_FOUND", String.format("No deliverer was found with id '%s'.", id));
  }
}
