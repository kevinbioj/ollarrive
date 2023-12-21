package fr.kevinbioj.ollarrive.server.business.tour.request;

import fr.kevinbioj.ollarrive.server.validation.OneOf;
import jakarta.validation.constraints.Min;
import lombok.Data;
import org.hibernate.validator.constraints.Range;

@Data
public class TourSearchRequest {

  /* Paramètres de tri */

  @OneOf(value = {"name", "startDate", "endDate"}, message = "sortBy.invalid")
  private String sortBy;

  @OneOf(value = {"asc", "desc"}, message = "sortOrder.invalid")
  private String sortOrder;

  /* Paramètres de pagination */

  @Min(value = 0, message = "page.min")
  private Integer page = 0;

  @Range(min = 1, max = 50, message = "limit.range")
  private Integer limit = 10;
}
