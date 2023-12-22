package fr.kevinbioj.ollarrive.server.business.tour.request;

import fr.kevinbioj.ollarrive.server.business.tour.TourEntity;
import fr.kevinbioj.ollarrive.server.validation.OneOf;
import jakarta.validation.constraints.Min;
import lombok.Data;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.Range;

@Data
public class TourSearchRequest {

  /* Critères de recherche */

  @Length(max = TourEntity.NAME_LIMIT, message = "name.length")
  private String name;

  /* Paramètres de tri */

  @OneOf(value = {"name", "startDate", "endDate"}, message = "sortBy.invalid")
  private String sortBy;

  @OneOf(value = {"asc", "desc"}, message = "sortOrder.invalid")
  private String sortOrder;

  /* Paramètres de pagination */

  @Min(value = 0, message = "page.min")
  private Integer page = 0;

  @Range(min = 5, max = 50, message = "itemsPerPage.range")
  private Integer itemsPerPage = 10;
}
