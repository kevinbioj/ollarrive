package fr.kevinbioj.ollarrive.server.business.tour;

import fr.kevinbioj.ollarrive.server.business.deliverer.DelivererDto;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Data;

@Data
public class TourDto {

  private UUID id;
  private String name;
  private OffsetDateTime startDate;
  private OffsetDateTime endDate;
  private DelivererDto deliverer;
}
