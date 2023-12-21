package fr.kevinbioj.ollarrive.server.business.tour.exception;

import fr.kevinbioj.ollarrive.server.business.AbstractBusinessException;
import java.util.UUID;

public class TourNotFoundException extends AbstractBusinessException {

  public TourNotFoundException(UUID id) {
    super("TOUR_NOT_FOUND", String.format("No tour was found with id '%s'.", id));
  }
}
