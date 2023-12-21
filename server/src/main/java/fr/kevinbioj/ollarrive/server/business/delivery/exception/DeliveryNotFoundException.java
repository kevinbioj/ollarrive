package fr.kevinbioj.ollarrive.server.business.delivery.exception;

import fr.kevinbioj.ollarrive.server.business.AbstractBusinessException;
import java.util.UUID;

public class DeliveryNotFoundException extends AbstractBusinessException {

  public DeliveryNotFoundException(UUID id) {
    super("DELIVERY_NOT_FOUND", String.format("No delivery was found with id '%s'.", id));
  }
}
