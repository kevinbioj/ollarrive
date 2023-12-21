package fr.kevinbioj.ollarrive.server.business.delivery;

import fr.kevinbioj.ollarrive.server.business.tour.TourDto;
import java.util.UUID;
import lombok.Data;

@Data
public class DeliveryDto {

  private UUID id;
  private String pickupAddress;
  private String deliveryAddress;
  private TourDto tour;
}
