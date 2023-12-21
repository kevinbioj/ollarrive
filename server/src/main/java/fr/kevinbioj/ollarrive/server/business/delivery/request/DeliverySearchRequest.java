package fr.kevinbioj.ollarrive.server.business.delivery.request;

import fr.kevinbioj.ollarrive.server.validation.OneOf;
import jakarta.validation.constraints.Min;
import lombok.Data;
import org.hibernate.validator.constraints.Range;

@Data
public class DeliverySearchRequest {

  /* Paramètres de tri */

  @OneOf(value = {"pickupAddress", "deliveryAddress"}, message = "sortBy.invalid")
  private String sortBy;

  @OneOf(value = {"asc", "desc"}, message = "sortOrder.invalid")
  private String sortOrder;

  /* Paramètres de pagination */

  @Min(value = 0, message = "page.min")
  private Integer page = 0;

  @Range(min = 1, max = 50, message = "limit.range")
  private Integer limit = 10;
}
