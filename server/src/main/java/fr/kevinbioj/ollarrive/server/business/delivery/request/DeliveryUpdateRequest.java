package fr.kevinbioj.ollarrive.server.business.delivery.request;

import jakarta.validation.constraints.NotBlank;
import java.util.UUID;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
public class DeliveryUpdateRequest {

  @NotBlank(message = "pickupAddress.required")
  @Length(max = 255, message = "pickupAddress.length")
  private String pickupAddress;

  @NotBlank(message = "deliveryAddress.required")
  @Length(max = 255, message = "deliveryAddress.length")
  private String deliveryAddress;

  private UUID tourId;
}
