package fr.kevinbioj.ollarrive.server.business.deliverer;

import java.time.Instant;
import java.util.UUID;
import lombok.Data;

@Data
public class DelivererDto {

  private UUID id;
  private String name;
  private boolean available;
  private Instant createdAt;
}
